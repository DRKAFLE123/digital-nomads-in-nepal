"use client"
import { useState, useEffect } from "react"
import { 
  Image as ImageIcon, Search, Upload, Trash2, Edit2, 
  X, Check, Loader2, Calendar, FileText, HardDrive, Link2 
} from "lucide-react"

interface MediaItem {
  id: string
  name: string
  url: string
  size: number
  alt: string | null
  createdAt: string
}

export default function MediaGalleryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Selection / Detail view state
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [editingAlt, setEditingAlt] = useState("")
  const [savingAlt, setSavingAlt] = useState(false)
  
  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadAlt, setUploadAlt] = useState("")
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Fetch all media
  async function fetchMedia() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/media")
      if (res.ok) {
        const data = await res.json()
        setMediaList(data)
      }
    } catch (err) {
      console.error("Failed to fetch media list:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // Handle Alt Text Update
  async function handleUpdateAlt(id: string) {
    setSavingAlt(true)
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: editingAlt })
      })

      if (res.ok) {
        const updatedItem = await res.json()
        setMediaList(prev => prev.map(item => item.id === id ? updatedItem : item))
        setSelectedItem(updatedItem)
        alert("Alt text updated successfully!")
      } else {
        alert("Failed to update alt text")
      }
    } catch (err) {
      console.error(err)
      alert("Error saving alt text")
    } finally {
      setSavingAlt(false)
    }
  }

  // Handle Deletion
  async function handleDeleteMedia(id: string) {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) return

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setMediaList(prev => prev.filter(item => item.id !== id))
        setSelectedItem(null)
        alert("Image deleted successfully.")
      } else {
        const errData = await res.json()
        alert(errData.error || "Failed to delete image")
      }
    } catch (err) {
      console.error(err)
      alert("Error deleting image")
    }
  }

  // Handle Upload
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!uploadFile) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", uploadFile)
    if (uploadAlt.trim()) {
      formData.append("alt", uploadAlt.trim())
    }

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        const newItem = await res.json()
        setMediaList(prev => [newItem, ...prev])
        setUploadFile(null)
        setUploadAlt("")
        setSelectedItem(newItem)
        alert("Image uploaded successfully!")
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

  // Filter list by search query
  const filteredMedia = mediaList.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Format File Size
  function formatBytes(bytes: number, decimals = 2) {
    if (!bytes) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <ImageIcon className="text-yellow-400" />
          Media Library
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload images, manage alt texts, and maintain visual assets for the site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Grid Area (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls: Search & Upload Form */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by filename or alt text..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-[#222] rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-sm"
              />
            </div>

            {/* Quick Upload Button Trigger/Label */}
            <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#333] hover:border-yellow-400/50 hover:bg-[#1a1a1a] text-gray-400 hover:text-white cursor-pointer transition-all text-sm font-semibold">
                <Upload size={16} />
                {uploadFile ? uploadFile.name : "Choose File"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              
              {uploadFile && (
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Enter Alt Text..."
                    value={uploadAlt}
                    onChange={e => setUploadAlt(e.target.value)}
                    className="bg-black border border-[#222] rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs w-full sm:w-48"
                  />
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all whitespace-nowrap disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check size={14} className="stroke-[3]" />
                    )}
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null)
                      setUploadAlt("")
                    }}
                    className="p-2 border border-[#333] hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Grid list of images */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="border border-dashed border-[#222] rounded-2xl py-24 text-center">
              <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No images found. Upload some visual assets to start!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map(item => {
                const isSelected = selectedItem?.id === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item)
                      setEditingAlt(item.alt || "")
                    }}
                    className={[
                      "group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 bg-black transition-all",
                      isSelected 
                        ? "border-yellow-400 scale-[0.98] shadow-lg shadow-yellow-500/5" 
                        : "border-[#1e1e1e] hover:border-gray-500"
                    ].join(" ")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt || item.name} className="object-cover w-full h-full" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate font-semibold">{item.name}</p>
                      {item.alt && (
                        <p className="text-[10px] text-yellow-400 truncate mt-0.5 font-medium">Alt: {item.alt}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Details Panel / Sidebar (1 Column) */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-6 shadow-sm sticky top-28">
              <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Asset Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Large Image Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#222] shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedItem.url} alt={selectedItem.alt || selectedItem.name} className="object-cover w-full h-full" />
              </div>

              {/* Asset Information list */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="flex items-center gap-1.5"><FileText size={13} /> Name</span>
                  <span className="text-white font-medium truncate max-w-[150px]">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="flex items-center gap-1.5"><HardDrive size={13} /> Size</span>
                  <span className="text-white font-medium">{formatBytes(selectedItem.size)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> Uploaded</span>
                  <span className="text-white font-medium">
                    {new Date(selectedItem.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span className="flex items-center gap-1.5"><Link2 size={13} /> Path URL</span>
                  <a 
                    href={selectedItem.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-yellow-400 hover:underline font-medium truncate max-w-[150px]"
                  >
                    View File
                  </a>
                </div>
              </div>

              {/* Alt Text Form */}
              <div className="border-t border-[#1e1e1e] pt-5 space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Alt Text (Accessibility & SEO)
                  </label>
                  <textarea
                    rows={3}
                    value={editingAlt}
                    onChange={e => setEditingAlt(e.target.value)}
                    placeholder="Describe the image context..."
                    className="w-full bg-black border border-[#222] rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-xs leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => handleUpdateAlt(selectedItem.id)}
                  disabled={savingAlt}
                  className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {savingAlt ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Edit2 size={13} />
                  )}
                  Save Alt Text
                </button>
              </div>

              {/* Delete Button Container */}
              <div className="border-t border-[#1e1e1e] pt-5">
                <button
                  onClick={() => handleDeleteMedia(selectedItem.id)}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Trash2 size={13} />
                  Delete Asset
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#111]/40 border border-dashed border-[#222] rounded-2xl p-6 text-center text-gray-500 text-xs py-12 sticky top-28">
              <ImageIcon className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              Select an image from the gallery to view details, configure Alt text, or delete.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
