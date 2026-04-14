// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    excerpt: { type: "string", required: true },
    coverImage: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" } },
    date: { type: "date", required: true },
    readTime: { type: "string", required: true },
    affiliates: { type: "boolean", default: false },
    featured: { type: "boolean", default: false },
    author: { type: "string", required: true }
  },
  computedFields: {
    url: { type: "string", resolve: (post) => `/blog/${post.slug}` }
  }
}));
var contentlayer_config_default = makeSource({ contentDirPath: "content", documentTypes: [Post] });
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-FAXY5EZQ.mjs.map
