import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    excerpt: { type: 'string', required: true },
    coverImage: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    date: { type: 'date', required: true },
    readTime: { type: 'string', required: true },
    affiliates: { type: 'boolean', default: false },
    featured: { type: 'boolean', default: false },
    author: { type: 'string', required: true }
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/blog/${post.slug}` }
  }
}))

export default makeSource({ contentDirPath: 'content', documentTypes: [Post] })
