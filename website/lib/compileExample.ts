import { visit } from "unist-util-visit";
import { execSync } from "child_process";
import { join } from "path";
import { writeFileSync, unlinkSync, mkdirSync, existsSync, readFileSync } from "fs";
import { createHash } from "crypto";

const EXAMPLES_PATH = "examples";

interface CompilerOptions {
  edition?: string;
  allowWarnings?: boolean;
  cacheDir?: string;
  enableCache?: boolean;
}

interface CompilationResult {
  success: boolean;
  output: string;
  warnings: string[];
  errors: string[];
  hash: string;
  timestamp: number;
}

interface RustBlock {
  node: any;
  code: string;
  mode: 'compile' | 'inline' | null;
  name: string | null;
  parent: any;
  index: number;
  position: number;
}

// In-memory cache for this session
const compilationCache = new Map<string, CompilationResult>();

let persistentCacheDir: string | null = null;

function initializePersistentCache(cacheDir?: string): void {
  if (!cacheDir) return;

  persistentCacheDir = cacheDir;
  if (!existsSync(persistentCacheDir)) {
    mkdirSync(persistentCacheDir, { recursive: true });
  }
}

function generateCacheKey(code: string, edition: string): string {
  const content = `${code}\n---EDITION---\n${edition}`;
  return createHash('sha256').update(content).digest('hex');
}

function loadFromPersistentCache(hash: string): CompilationResult | null {
  if (!persistentCacheDir) return null;

  const cacheFile = join(persistentCacheDir, `${hash}.json`);
  if (!existsSync(cacheFile)) return null;

  try {
    const data = readFileSync(cacheFile, 'utf-8');
    const result = JSON.parse(data) as CompilationResult;

    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - result.timestamp > maxAge) {
      unlinkSync(cacheFile);
      return null;
    }

    return result;
  } catch {
    try { unlinkSync(cacheFile); } catch { }
    return null;
  }
}

function saveToPersistentCache(result: CompilationResult): void {
  if (!persistentCacheDir) return;

  const cacheFile = join(persistentCacheDir, `${result.hash}.json`);
  try {
    writeFileSync(cacheFile, JSON.stringify(result), 'utf-8');
  } catch (error) {
    console.warn('Failed to save compilation cache:', error);
  }
}

function getCachedResult(hash: string, enableCache: boolean): CompilationResult | null {
  if (!enableCache) return null;

  const memoryResult = compilationCache.get(hash);
  if (memoryResult) return memoryResult;

  const persistentResult = loadFromPersistentCache(hash);
  if (persistentResult) {
    compilationCache.set(hash, persistentResult);
    return persistentResult;
  }

  return null;
}

function cacheResult(result: CompilationResult, enableCache: boolean): void {
  if (!enableCache) return;
  compilationCache.set(result.hash, result);
  saveToPersistentCache(result);
}

function parseMetaAttributes(meta: string): { mode: 'compile' | 'inline' | null; name: string | null; fileName: string | null } {
  if (!meta) return { mode: null, name: null, fileName: null };

  const modeMatch = meta.match(/mode=["']?(compile|inline)["']?/);
  const mode = modeMatch ? (modeMatch[1] as 'compile' | 'inline') : null;

  const nameMatch = meta.match(/name=["']?([^"'\s]+)["']?/);
  const name = nameMatch ? nameMatch[1] : null;

  const fileNameMatch = meta.match(/fileName=["']?([^"'\s]+)["']?/);
  const fileName = fileNameMatch ? fileNameMatch[1] : null;

  return { mode, name, fileName };
}

function processInlineReferences(
  code: string,
  inlineBlocksMap: Map<string, string>
): { processedCode: string; referencedBlocks: Set<string> } {
  const lines = code.split('\n');
  const processedLines: string[] = [];
  const referencedBlocks = new Set<string>();

  for (const line of lines) {
    const inlineMatch = line.match(/^(\s*)\/\/\s*\[!code\s+inline:([^\]]+)\]/);

    if (inlineMatch) {
      const indentation = inlineMatch[1];
      const blockName = inlineMatch[2].trim();
      const inlineCode = inlineBlocksMap.get(blockName);

      if (inlineCode) {
        const inlineLines = inlineCode.split('\n');
        const indentedLines = inlineLines.map(inlineLine =>
          inlineLine.trim() === '' ? inlineLine : indentation + inlineLine
        );
        processedLines.push(...indentedLines);
        referencedBlocks.add(blockName);
      } else {
        processedLines.push(`${indentation}// ERROR: inline block '${blockName}' not found`);
        console.warn(`Warning: Inline block '${blockName}' referenced but not found`);
      }
    } else {
      processedLines.push(line);
    }
  }

  return { processedCode: processedLines.join('\n'), referencedBlocks };
}

function compileRustCode(
  code: string,
  hash: string,
  exampleLibPath: string
): CompilationResult {
  const binPath = join(exampleLibPath, "src", "bin", `${hash}.rs`);
  const cargoTomlPath = join(exampleLibPath, "Cargo.toml");

  try {
    let finalCode = code;
    if (!code.includes("fn main")) {
      finalCode = `fn main() {\n${code}\n}`;
    }

    writeFileSync(binPath, finalCode, "utf-8");

    try {
      const output = execSync(
        `cargo check --bin ${hash} --manifest-path "../${cargoTomlPath}"`,
        {
          cwd: exampleLibPath,
          stdio: "pipe",
          encoding: "utf-8",
          timeout: 30000,
        }
      );

      const warnings = output.toString()
        .split("\n")
        .filter((line) => line.includes("warning:"))
        .map((line) => line.trim());

      return {
        success: true,
        output: output.toString(),
        warnings,
        errors: [],
        hash,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      const stderr = error.stderr?.toString() || error.message || "Unknown error";

      const errors = stderr
        .split("\n")
        .filter((line) => line.includes("error:") || line.includes("error["))
        .map((line) => line.trim());

      const warnings = stderr
        .split("\n")
        .filter((line) => line.includes("warning:"))
        .map((line) => line.trim());

      return {
        success: false,
        output: stderr,
        warnings,
        errors,
        hash,
        timestamp: Date.now(),
      };
    }
  } catch (error: any) {
    return {
      success: false,
      output: error.message || "Unknown error",
      warnings: [],
      errors: [error.message || "Unknown error"],
      hash,
      timestamp: Date.now(),
    };
  } finally {
    try { unlinkSync(binPath); } catch { }
  }
}

export function reremarkExampleCompiler(options: CompilerOptions = {}) {
  const {
    edition = "2024",
    allowWarnings = true,
    cacheDir,
    enableCache = true
  } = options;

  initializePersistentCache(cacheDir);

  return function (tree: any, file: any) {
    const rustBlocks: RustBlock[] = [];
    let positionCounter = 0;

    visit(tree, "code", function (node, index, parent) {
      if (node?.lang === "rust") {
        const { mode, name } = parseMetaAttributes(node.meta || '');

        if (mode === 'compile' || mode === 'inline') {
          const rustCode = node.value;
          if (!rustCode.trim()) return;

          rustBlocks.push({
            node,
            code: rustCode,
            mode,
            name,
            parent,
            index: index || 0,
            position: positionCounter++
          });
        }
      }
    });

    const compileBlocks = rustBlocks.filter(b => b.mode === 'compile');

    if (compileBlocks.length === 0) return tree;

    if (compileBlocks.length > 1) {
      console.error('Error: Multiple mode="compile" blocks found. Only one is allowed.');
      compileBlocks.forEach(block => {
        block.node.meta = (block.node.meta || '') + ' compile-result="Error" compile-error="Multiple compile blocks"';
      });
      return tree;
    }

    const compileBlock = compileBlocks[0];

    const inlineBlocks = rustBlocks.filter(b => b.mode === 'inline');
    const inlineBlocksMap = new Map<string, string>();

    inlineBlocks.forEach(block => {
      if (!block.name) {
        console.warn(`Warning: Inline block at position ${block.position} has no name and cannot be referenced`);
      } else {
        if (inlineBlocksMap.has(block.name)) {
          console.warn(`Warning: Duplicate inline block name '${block.name}' - using the last occurrence`);
        }
        inlineBlocksMap.set(block.name, block.code);
      }
    });

    const { processedCode, referencedBlocks } = processInlineReferences(
      compileBlock.code,
      inlineBlocksMap
    );

    compileBlock.node.value = processedCode;

    const hash = generateCacheKey(processedCode, edition);

    let compilationResult = getCachedResult(hash, enableCache);

    if (!compilationResult) {
      console.log(`Compiling Rust code (hash: ${hash.substring(0, 8)}...) with ${referencedBlocks.size} inline references`);
      compilationResult = compileRustCode(processedCode, hash, EXAMPLES_PATH);
      cacheResult(compilationResult, enableCache);
    } else {
      console.log(`Using cached result (hash: ${hash.substring(0, 8)}...)`);
    }

    if (!compilationResult.success) console.error(compilationResult.errors);

    const resultStatus = compilationResult.success ? "Success" : "Fail";
    if (compileBlock.node.meta.includes('compile-result=')) {
      compileBlock.node.meta = compileBlock.node.meta.replace(/compile-result=["']?[^"'\s]*["']?/, `compile-result="${resultStatus}"`);
    } else {
      compileBlock.node.meta = compileBlock.node.meta + ` compile-result="${resultStatus}"`;
    }

    if (compilationResult.warnings.length > 0) {
      compileBlock.node.meta += ` compile-warnings="${compilationResult.warnings.length}"`;
    }
    if (compilationResult.errors.length > 0) {
      compileBlock.node.meta += ` compile-errors="${compilationResult.errors.length}"`;
    }

    inlineBlocks.forEach(block => {
      if (block.name && referencedBlocks.has(block.name)) {
        if (!block.node.meta.includes('compile-referenced')) {
          block.node.meta = (block.node.meta || '') + ' compile-referenced="true"';
        }
      }
    });

    return tree;
  };
}

export default reremarkExampleCompiler;

/**
 * Parse meta string to extract compile metadata for rehypeShiki
 */
export function parseCompileMetaString(metaString: string) {
  if (!metaString) return null;

  const result: Record<string, any> = {};

  const compileFileMatch = metaString.match(/fileName="([^"]*)"/);
  if (compileFileMatch) result.fileName = compileFileMatch[1];

  const compileResultMatch = metaString.match(/compile-result="([^"]*)"/);
  if (compileResultMatch) result.compileResult = compileResultMatch[1];

  const compileWarningsMatch = metaString.match(/compile-warnings="([^"]*)"/);
  if (compileWarningsMatch) result.compileWarnings = compileWarningsMatch[1];

  const compileErrorsMatch = metaString.match(/compile-errors="([^"]*)"/);
  if (compileErrorsMatch) result.compileErrors = compileErrorsMatch[1];

  return Object.keys(result).length > 0 ? result : null;
}
