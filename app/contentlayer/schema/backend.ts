import {
  defineDocumentType,
  defineNestedType
} from "@contentlayer/source-files"
import { urlFromFilePath } from "../utils/url-from-file-path"

const BackendFeature = defineNestedType(() => ({
  name: "BackendFeature",
  fields: {
    title: {
      type: "string",
      description: "The name of the feature.",
      required: true
    },
    description: {
      type: "string",
      description: "A short explanation of the feature.",
      required: true
    }
  }
}))

const BackendSpec = defineNestedType(() => ({
  name: "BackendSpec",
  fields: {
    label: {
      type: "string",
      description: "The label of the spec.",
      required: true
    },
    value: {
      type: "string",
      description: "The value of the spec.",
      required: true
    }
  }
}))

export const Backend = defineDocumentType(() => ({
  name: "Backend",
  filePathPattern: `backend/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The display name of the backend.",
      required: true
    },
    crate: {
      type: "string",
      description: "The crates.io crate name.",
      required: true
    },
    kind: {
      type: "string",
      description: "The type of infrastructure the backend runs on.",
      required: true
    },
    accent: {
      type: "string",
      description: "Tailwind gradient classes used as the accent color.",
      required: true
    },
    excerpt: {
      type: "string",
      description: "The one-line tagline for the backend.",
      required: true
    },
    description: {
      type: "string",
      description: "A longer description of the backend.",
      required: true
    },
    license: {
      type: "string",
      description: "The license of the backend crate.",
      required: true
    },
    install: {
      type: "string",
      description: "The cargo command used to install the crate.",
      required: true
    },
    docsUrl: {
      type: "string",
      description: "Link to the crate documentation.",
      required: true
    },
    repoUrl: {
      type: "string",
      description: "Link to the crate source repository.",
      required: true
    },
    features: {
      type: "list",
      description: "The features of the backend.",
      of: BackendFeature,
      required: true
    },
    specs: {
      type: "list",
      description: "The at-a-glance specs of the backend.",
      of: BackendSpec,
      required: true
    },
    bestFor: {
      type: "list",
      description: "Workloads the backend is well suited to.",
      of: { type: "string" },
      required: true
    }
  },
  computedFields: {
    urlPath: {
      type: "string",
      description: "The URL path of this backend page.",
      resolve: urlFromFilePath
    }
  }
}))
