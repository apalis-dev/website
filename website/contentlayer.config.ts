import { Tutorial } from "./app/contentlayer/schema/tutorial";
import { BlogPost } from "./app/contentlayer/schema/blog-post";
import { DocsPage } from "./app/contentlayer/schema/docs-page";
import { makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeShiki from '@shikijs/rehype'
import rehypeRaw from "rehype-raw";
import { nodeTypes } from "@mdx-js/mdx";
import codeImport from "remark-code-import";
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import rehypeSlug from "rehype-slug";
import rehypeMermaid from "./lib/rehypeMermaid";
import remarkExampleCompiler, { parseCompileMetaString } from "./lib/compileExample";
import { transformerNotationHighlight, transformerNotationWordHighlight, transformerMetaHighlight } from '@shikijs/transformers'
export const CODE_BLOCK_FILENAME_REGEX = /fileName="([^"]+)"/;

const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS: RehypePrettyCodeOptions = {
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node: any) {
    if (!node.properties.className) node.properties.className = [];
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedChars(node: any) {
    node.properties.className = ["highlighted"];
  },
  filterMetaString: (meta: string) =>
    meta.replace(CODE_BLOCK_FILENAME_REGEX, ""),
};

export default makeSource({
  contentDirPath: "content",
  documentTypes: [DocsPage, BlogPost, Tutorial],
  mdx: {
    remarkPlugins: [
      [remarkExampleCompiler, {}],
      [codeImport as any, { rootDir: process.cwd() + "/content" }],
      remarkGfm,

    ],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: {
            light: "github-light",
            dark: "github-dark"
          },
          transformers: [
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
            transformerMetaHighlight()
          ],
          langs: ["rust"],
          defaultColor: 'dark',
          parseMetaString: parseCompileMetaString,
        },
      ],

      [
        rehypeMermaid,
        {
          background: "transparent",
          className: "mermaid-diagram",
        },
      ],
      [rehypeRaw, { passThrough: nodeTypes }],

      [
        rehypePrettyCode,
        {
          ...DEFAULT_REHYPE_PRETTY_CODE_OPTIONS, theme: {
            light: "github-light",
            dark: "github-dark"
          },
        },
      ] as any,

      [rehypeSlug],
      [rehypeMdxCodeProps],
    ],
  },
});
