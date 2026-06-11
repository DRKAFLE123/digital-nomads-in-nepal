"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Heading2, Heading3, Link2, Table, 
  Image as ImageIcon, Eye, Columns, FileText, 
  X, Upload, Check, Loader2, Bold, List, Italic 
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Post {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  readTime: string
  author: string
  published: boolean
  affiliates: boolean
  featured: boolean
}

interface MediaItem {
  id?: string
  name: string
  url: string
  size: number
  createdAt: string
  alt?: string | null
}

const markdownComponents = {
  a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<"a">) => {
    if (href && (href.includes("youtube.com") || href.includes("youtu.be"))) {
      let videoId = ""
      try {
        if (href.includes("youtube.com/watch")) {
          const urlObj = new URL(href)
          videoId = urlObj.searchParams.get("v") || ""
        } else if (href.includes("youtu.be/")) {
          videoId = href.split("youtu.be/")[1]?.split("?")[0] || ""
        } else if (href.includes("youtube.com/embed/")) {
          videoId = href.split("youtube.com/embed/")[1]?.split("?")[0] || ""
        }
      } catch (e) {
        console.error("Failed to parse YouTube URL:", e)
      }
      
      if (videoId) {
        return (
          <span className="block my-6 w-full aspect-video rounded-xl overflow-hidden border border-[#222] shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </span>
        )
      }
    }
    return (
      <a href={href} className="text-[#FFD700] no-underline hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }
}

export default function PostEditor({ initialData }: { initialData?: Post }) {
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"write" | "preview" | "split">("write")

  // Media Modal state
  const [isMediaOpen, setIsMediaOpen] = useState(false)
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [externalUrl, setExternalUrl] = useState("")

  // Auto-slug controls
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // Alt Text state
  const [altText, setAltText] = useState("")

  // Slash Commands state
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashQuery, setSlashQuery] = useState("")
  const [slashIndex, setSlashIndex] = useState(0)

  const [form, setForm] = useState<Post>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    category: initialData?.category || "Cost of Living",
    tags: initialData?.tags || [],
    readTime: initialData?.readTime || "1 min read",
    author: initialData?.author || "Admin",
    published: initialData?.published ?? true,
    affiliates: initialData?.affiliates ?? false,
    featured: initialData?.featured ?? false,
  })

  const [tagsInput, setTagsInput] = useState(form.tags.join(", "))

  // Word count & Read time calculation
  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length

  // Dynamically update read time based on word count
  useEffect(() => {
    const mins = Math.max(1, Math.ceil(wordCount / 200))
    setForm(f => ({ ...f, readTime: `${mins} min read` }))
  }, [wordCount])

  // Fetch media library items
  async function fetchMedia() {
    setLoadingMedia(true)
    try {
      const res = await fetch("/api/admin/media")
      if (res.ok) {
        const data = await res.json()
        setMediaList(data)
      }
    } catch (err) {
      console.error("Failed to load media:", err)
    } finally {
      setLoadingMedia(false)
    }
  }

  useEffect(() => {
    if (isMediaOpen) {
      fetchMedia()
    }
  }, [isMediaOpen])

  // Handle local file upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", files[0])

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        const newMedia = await res.json()
        setMediaList(prev => [newMedia, ...prev])
        setSelectedMedia(newMedia)
        setAltText("")
      } else {
        const errData = await res.json()
        alert(errData.error || "Upload failed")
      }
    } catch (err) {
      console.error(err)
      alert("Error uploading file")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload = {
      ...form,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    }

    const isEditing = !!initialData?.id
    const url = isEditing ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts"
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save post")
      }
      router.push("/admin/posts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLoading(false)
    }
  }

  function handleAutoSlug() {
    setForm(f => ({
      ...f,
      slug: f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }))
    setIsSlugManuallyEdited(false)
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    const newSlug = isSlugManuallyEdited 
      ? form.slug 
      : newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    
    setForm(f => ({ ...f, title: newTitle, slug: newSlug }))
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, slug: e.target.value })
    setIsSlugManuallyEdited(true)
  }

  // Helper to insert markdown tags at selection
  function insertAtCursor(before: string, after: string = "") {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.content
    const selected = text.substring(start, end)
    const replacement = before + selected + after

    setForm({
      ...form,
      content: text.substring(0, start) + replacement + text.substring(end)
    })

    // Refocus and place cursor/selection
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 50)
  }

  function insertTable() {
    const tableTemplate = "\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n"
    insertAtCursor(tableTemplate)
  }

  function insertYouTube() {
    const url = prompt("Enter YouTube Video URL:")
    if (!url) return
    insertAtCursor(`\n[YouTube Video](${url.trim()})\n`)
  }

  function handleMediaSelectAction(action: "editor" | "cover") {
    if (action === "cover") {
      if (selectedMedia) {
        setForm(f => ({ ...f, coverImage: selectedMedia.url }))
      } else if (externalUrl) {
        setForm(f => ({ ...f, coverImage: externalUrl }))
      }
      setIsMediaOpen(false)
      setSelectedMedia(null)
      setExternalUrl("")
    } else {
      const url = selectedMedia ? selectedMedia.url : externalUrl
      if (url) {
        const alt = altText.trim() || "Image description"
        insertAtCursor(`\n![${alt}](${url})\n`)
      }
      setIsMediaOpen(false)
      setSelectedMedia(null)
      setExternalUrl("")
      setAltText("")
    }
  }

  // Formatting Slash Command setup
  const slashCommandsList = [
    { name: "h2", label: "Heading 2", shortcut: "/h2", before: "\n## ", after: "\n" },
    { name: "h3", label: "Heading 3", shortcut: "/h3", before: "\n### ", after: "\n" },
    { name: "bold", label: "Bold Text", shortcut: "/bold", before: "**", after: "**" },
    { name: "italic", label: "Italic Text", shortcut: "/italic", before: "*", after: "*" },
    { name: "list", label: "Bullet List", shortcut: "/list", before: "\n- ", after: "" },
    { name: "link", label: "Insert Link", shortcut: "/link", type: "prompt-link" },
    { name: "table", label: "Markdown Table", shortcut: "/table", type: "table" },
    { name: "youtube", label: "YouTube Video", shortcut: "/youtube", type: "youtube" },
    { name: "image", label: "Media Library", shortcut: "/image", type: "media" },
  ]

  const filteredCommands = slashCommandsList.filter(c => 
    c.name.includes(slashQuery.toLowerCase()) || c.label.toLowerCase().includes(slashQuery.toLowerCase())
  )

  function executeSlashCommand(cmd: typeof slashCommandsList[0]) {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursor = textarea.selectionStart
    const value = form.content
    const textBeforeCursor = value.substring(0, cursor)
    const lastSlashIndex = textBeforeCursor.lastIndexOf("/")

    if (lastSlashIndex === -1) return

    // Clean slash text
    const cleanContent = value.substring(0, lastSlashIndex) + value.substring(cursor)
    setForm(f => ({ ...f, content: cleanContent }))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lastSlashIndex, lastSlashIndex)

      if (cmd.type === "table") {
        insertTable()
      } else if (cmd.type === "youtube") {
        insertYouTube()
      } else if (cmd.type === "media") {
        setIsMediaOpen(true)
      } else if (cmd.type === "prompt-link") {
        const text = prompt("Link Text:")
        const url = prompt("URL:")
        if (text && url) insertAtCursor(`[${text}](${url})`)
      } else {
        insertAtCursor(cmd.before || "", cmd.after || "")
      }
    }, 50)

    setShowSlashMenu(false)
    setSlashIndex(0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showSlashMenu && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSlashIndex(prev => (prev + 1) % filteredCommands.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSlashIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        executeSlashCommand(filteredCommands[slashIndex])
      } else if (e.key === "Escape") {
        e.preventDefault()
        setShowSlashMenu(false)
      }
    }
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget
    const value = textarea.value
    const cursor = textarea.selectionStart

    const textBeforeCursor = value.substring(0, cursor)
    const match = textBeforeCursor.match(/\/(\w*)$/)

    if (match) {
      setShowSlashMenu(true)
      setSlashQuery(match[1])
    } else {
      setShowSlashMenu(false)
    }
  }

  const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.524 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108C24 15.974 24 12 24 12s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-yellow-400" />
            {initialData ? "Edit Post" : "New Blog Post"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Design and publish dynamic rich-text articles.</p>
        </div>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-5 py-2.5 rounded-lg border border-[#333] text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-all text-sm font-semibold"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading} 
            className="px-5 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-bold transition-all text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Save Post"}
          </button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Elements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
            {/* Title / Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Post Title</label>
                <input 
                  type="text" 
                  required 
                  value={form.title} 
                  onChange={handleTitleChange}
                  placeholder="e.g. Living in Kathmandu as a Nomad"
                  className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Url Slug 
                  <button type="button" onClick={handleAutoSlug} className="text-yellow-500 text-xs ml-2 hover:underline font-medium">(Auto-generate)</button>
                </label>
                <input 
                  type="text" 
                  required 
                  value={form.slug} 
                  onChange={handleSlugChange}
                  placeholder="living-in-kathmandu"
                  className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-sm" 
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Excerpt (Brief Description)</label>
              <textarea 
                required 
                rows={2} 
                value={form.excerpt} 
                onChange={e => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A compelling summary of the article..."
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-sm" 
              />
            </div>

            {/* Layout Toggles and Wordpress Formatting Toolbar */}
            <div className="border-t border-[#1e1e1e] pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                {/* Editing Toolbar */}
                <div className="flex items-center flex-wrap gap-1 bg-black border border-[#222] p-1 rounded-lg">
                  <button 
                    type="button" onClick={() => insertAtCursor("## ")} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Heading 2"
                  >
                    <Heading2 size={16} />
                  </button>
                  <button 
                    type="button" onClick={() => insertAtCursor("### ")} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Heading 3"
                  >
                    <Heading3 size={16} />
                  </button>
                  <button 
                    type="button" onClick={() => insertAtCursor("**", "**")} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button 
                    type="button" onClick={() => insertAtCursor("*", "*")} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <button 
                    type="button" onClick={() => insertAtCursor("- ")} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <div className="w-px h-6 bg-[#222] mx-1" />
                  <button 
                    type="button" 
                    onClick={() => {
                      const text = prompt("Link Text:")
                      const url = prompt("URL:")
                      if (text && url) insertAtCursor(`[${text}](${url})`)
                    }} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Insert Link"
                  >
                    <Link2 size={16} />
                  </button>
                  <button 
                    type="button" onClick={insertTable} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Insert Table"
                  >
                    <Table size={16} />
                  </button>
                  <button 
                    type="button" onClick={insertYouTube} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Insert YouTube Link"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" onClick={() => setIsMediaOpen(true)} 
                    className="p-2 hover:bg-[#1a1a1a] hover:text-yellow-400 text-gray-400 rounded transition-all" title="Insert Image / Media Library"
                  >
                    <ImageIcon size={16} />
                  </button>
                </div>

                {/* Split/Preview Screen Selection */}
                <div className="flex bg-black border border-[#222] p-1 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1.5 rounded transition-all ${activeTab === "write" ? "bg-yellow-400 text-black" : "text-gray-400 hover:text-white"}`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 rounded transition-all ${activeTab === "preview" ? "bg-yellow-400 text-black" : "text-gray-400 hover:text-white"}`}
                  >
                    <span className="flex items-center gap-1"><Eye size={12} /> Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("split")}
                    className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded transition-all ${activeTab === "split" ? "bg-yellow-400 text-black" : "text-gray-400 hover:text-white"}`}
                  >
                    <Columns size={12} /> Split
                  </button>
                </div>
              </div>

              {/* Editor Workspace Content */}
              <div className="grid grid-cols-1 gap-4">
                {activeTab === "write" && (
                  <div className="relative">
                    <textarea 
                      ref={textareaRef}
                      required 
                      rows={18} 
                      value={form.content} 
                      onChange={e => setForm({ ...form, content: e.target.value })}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                      placeholder="Write your blog content here in markdown... Type '/' for formatting commands."
                      className="w-full font-mono text-sm bg-black border border-[#222] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all leading-relaxed" 
                    />
                    
                    {/* Floating Slash Commands Dropdown */}
                    {showSlashMenu && filteredCommands.length > 0 && (
                      <div className="absolute bottom-4 left-4 z-40 bg-[#161616] border border-[#222] rounded-xl p-2 w-64 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-3 py-1 mb-1">Slash Commands</div>
                        <div className="space-y-0.5 max-h-48 overflow-y-auto">
                          {filteredCommands.map((cmd, idx) => {
                            const isSelected = idx === slashIndex
                            return (
                              <button
                                key={cmd.name}
                                type="button"
                                onClick={() => executeSlashCommand(cmd)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? "bg-yellow-400 text-black font-bold" 
                                    : "text-gray-300 hover:bg-[#222] hover:text-white"
                                }`}
                              >
                                <span>{cmd.label}</span>
                                <span className={`text-[10px] font-mono ${isSelected ? "text-black/60" : "text-gray-500"}`}>{cmd.shortcut}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "preview" && (
                  <div className="prose prose-invert prose-lg max-w-none w-full bg-black border border-[#222] rounded-xl p-6 min-h-[440px] overflow-y-auto max-h-[500px]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {form.content || "*Nothing to preview yet.*"}
                    </ReactMarkdown>
                  </div>
                )}

                {activeTab === "split" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <textarea 
                        ref={textareaRef}
                        required 
                        rows={18} 
                        value={form.content} 
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        placeholder="Write your content... Type '/' for formatting commands."
                        className="w-full font-mono text-sm bg-black border border-[#222] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all leading-relaxed" 
                      />
                      
                      {/* Floating Slash Commands Dropdown */}
                      {showSlashMenu && filteredCommands.length > 0 && (
                        <div className="absolute bottom-4 left-4 z-40 bg-[#161616] border border-[#222] rounded-xl p-2 w-64 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-3 py-1 mb-1">Slash Commands</div>
                          <div className="space-y-0.5 max-h-48 overflow-y-auto">
                            {filteredCommands.map((cmd, idx) => {
                              const isSelected = idx === slashIndex
                              return (
                                <button
                                  key={cmd.name}
                                  type="button"
                                  onClick={() => executeSlashCommand(cmd)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                                    isSelected 
                                      ? "bg-yellow-400 text-black font-bold" 
                                      : "text-gray-300 hover:bg-[#222] hover:text-white"
                                  }`}
                                >
                                  <span>{cmd.label}</span>
                                  <span className={`text-[10px] font-mono ${isSelected ? "text-black/60" : "text-gray-500"}`}>{cmd.shortcut}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none w-full bg-black border border-[#222] rounded-xl p-5 overflow-y-auto max-h-[440px]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {form.content || "*Nothing to preview.*"}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Metadata configurations */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222] pb-3">Publish Settings</h2>
            
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</label>
              <select 
                required 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm"
              >
                <option>Cost of Living</option>
                <option>Destinations</option>
                <option>Work Setup</option>
                <option>Lifestyle</option>
                <option>Visa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Author</label>
              <input 
                type="text" 
                required 
                value={form.author} 
                onChange={e => setForm({ ...form, author: e.target.value })}
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Read Time</label>
              <input 
                type="text" 
                required 
                value={form.readTime} 
                onChange={e => setForm({ ...form, readTime: e.target.value })}
                placeholder="5 min read"
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm animate-pulse" 
              />
              <div className="text-[10px] text-gray-500 mt-1 font-medium flex items-center justify-between">
                <span>Auto-calculated:</span>
                <span className="text-yellow-400 font-bold">{wordCount.toLocaleString()} words</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
              <input 
                type="text" 
                value={tagsInput} 
                onChange={e => setTagsInput(e.target.value)} 
                placeholder="e.g. trekking, internet, cost"
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-sm" 
              />
            </div>

            <div className="flex flex-col gap-3 pt-3 border-t border-[#1e1e1e]">
              <label className="flex items-center gap-2.5 cursor-pointer text-gray-300 text-sm">
                <input 
                  type="checkbox" 
                  checked={form.published} 
                  onChange={e => setForm({ ...form, published: e.target.checked })} 
                  className="rounded border-[#333] bg-black text-yellow-500 focus:ring-yellow-500/50" 
                />
                Published (Public)
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-gray-300 text-sm">
                <input 
                  type="checkbox" 
                  checked={form.featured} 
                  onChange={e => setForm({ ...form, featured: e.target.checked })} 
                  className="rounded border-[#333] bg-black text-yellow-500 focus:ring-yellow-500/50" 
                />
                Featured Post
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-gray-300 text-sm">
                <input 
                  type="checkbox" 
                  checked={form.affiliates} 
                  onChange={e => setForm({ ...form, affiliates: e.target.checked })} 
                  className="rounded border-[#333] bg-black text-yellow-500 focus:ring-yellow-500/50" 
                />
                Contains Affiliates
              </label>
            </div>
          </div>

          {/* Cover Image Settings Card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#222] pb-3">Cover Image</h2>
            {form.coverImage ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#222] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="Post Cover" className="object-cover w-full h-full" />
                <button 
                  type="button" 
                  onClick={() => setForm({ ...form, coverImage: "" })}
                  className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-red-600/90 text-white rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-[#333] rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <ImageIcon className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-xs text-gray-500">No cover image set</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Image URL</label>
              <input 
                type="url" 
                required 
                value={form.coverImage} 
                onChange={e => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://..."
                className="w-full bg-black border border-[#222] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs" 
              />
            </div>
            <button 
              type="button" 
              onClick={() => setIsMediaOpen(true)}
              className="w-full py-2 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/20 text-yellow-400 font-semibold rounded-lg text-xs transition-all"
            >
              Choose from Media Library
            </button>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {isMediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="text-yellow-400 animate-pulse" />
                Media Manager
              </h3>
              <button 
                type="button" 
                onClick={() => setIsMediaOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
              
              {/* Media Uploader & Input Form */}
              <div className="md:col-span-1 space-y-5 border-r border-[#222] pr-0 md:pr-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Upload Image</h4>
                  <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-[#333] hover:border-yellow-500/50 rounded-xl cursor-pointer bg-black/30 hover:bg-yellow-500/5 transition-all">
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mb-2" />
                        <span className="text-xs text-gray-400 font-medium">Uploading file...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center px-4 text-center">
                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                        <span className="text-xs text-gray-300 font-bold">Select Local Image</span>
                        <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, WEBP formats supported</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      disabled={uploading} 
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-[#222]">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Import from External URL</h4>
                  <input 
                    type="url" 
                    value={externalUrl} 
                    onChange={e => {
                      setSelectedMedia(null)
                      setExternalUrl(e.target.value)
                      setAltText("")
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs mb-3" 
                  />
                  {(selectedMedia || externalUrl) && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Image Alt Text</span>
                          <span className="text-gray-600 lowercase">(for SEO/accessibility)</span>
                        </label>
                        <input
                          type="text"
                          value={altText}
                          onChange={e => setAltText(e.target.value)}
                          placeholder="Brief description of the image..."
                          className="w-full bg-black border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button 
                          type="button" 
                          onClick={() => handleMediaSelectAction("editor")}
                          className="w-full py-2 bg-yellow-400 text-black font-bold text-xs rounded-lg hover:bg-yellow-500 transition-all shadow"
                        >
                          Insert Into Post Content
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleMediaSelectAction("cover")}
                          className="w-full py-2 bg-white/10 text-white font-semibold text-xs border border-white/10 hover:bg-white/20 rounded-lg transition-all"
                        >
                          Set as Cover Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid of Existing Library Items */}
              <div className="md:col-span-2 flex flex-col min-h-0">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Media Library</h4>
                {loadingMedia ? (
                  <div className="flex-1 flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                  </div>
                ) : mediaList.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <ImageIcon className="w-10 h-10 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500">No uploads found. Upload your first image!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[50vh] pr-2">
                    {mediaList.map((media) => {
                      const isSelected = selectedMedia?.name === media.name
                      return (
                        <div 
                          key={media.name}
                          onClick={() => {
                            setExternalUrl("")
                            setSelectedMedia(media)
                            setAltText(media.alt || "")
                          }}
                          className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 bg-black transition-all ${
                            isSelected ? "border-yellow-400 scale-[0.98] shadow-lg shadow-yellow-500/5" : "border-[#222] hover:border-gray-500"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={media.url} alt={media.name} className="object-cover w-full h-full" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] text-white truncate font-medium">{media.name}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black p-1 rounded-full shadow">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
