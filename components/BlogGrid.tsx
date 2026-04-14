import BlogCard from "./BlogCard"

interface BlogGridProps {
  posts: any[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return <div className="text-[#A0A0A0] text-center py-20 text-lg">No posts found matching your criteria.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard 
          key={post.slug}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          coverImage={post.coverImage}
          category={post.category}
          readTime={post.readTime}
          date={new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        />
      ))}
    </div>
  )
}
