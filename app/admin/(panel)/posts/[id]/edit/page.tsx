import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PostEditor from "../../PostEditor"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id }
  })

  if (!post) notFound()

  const postEditorData = {
    ...post,
    tags: Array.isArray(post.tags) ? (post.tags as string[]) : []
  }

  return <PostEditor initialData={postEditorData} />
}
