import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = "https://eaewrqwealhzimrnorjw.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhZXdycXdlYWxoemltcm5vcmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjg4NzIsImV4cCI6MjA3OTkwNDg3Mn0.Np2xN396WgQQ-9uyiaEYzBG8LMFY79V5n6KnAPopTgs"

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  return supabaseInstance
}

export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}

export type Category = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  created_at: string
}

export type Competition = {
  id: string
  title: string
  description: string
  category_id: string
  organizer: string
  registration_start: string
  registration_end: string
  event_start: string
  event_end: string
  location: string
  is_online: boolean
  registration_link: string
  prize: string
  requirements: string
  contact_info: string
  image_url: string
  is_featured: boolean
  created_at: string
  updated_at: string
  user_id?: string
  categories?: Category
  users?: User
}

export type Bookmark = {
  id: string
  competition_id: string
  created_at: string
}

export type Comment = {
  id: string
  competition_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  users?: User
}

const BOOKMARKS_STORAGE_KEY = "bookmarks"
const COMMENTS_STORAGE_KEY = "comments"

function getLocalBookmarks(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function setLocalBookmarks(bookmarks: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks))
}

function getLocalComments(): Comment[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(COMMENTS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function setLocalComments(comments: Comment[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments))
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "lombaku_salt_2025")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function uploadImage(file: File): Promise<string | null> {
  const supabase = getSupabaseClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `competitions/${fileName}`

  try {
    console.log("[v0] Starting image upload:", filePath)

    const { error, data } = await supabase.storage.from("competition-images").upload(filePath, file)

    if (error) {
      console.error("[v0] Upload error:", error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    console.log("[v0] Upload successful, getting public URL")

    const {
      data: { publicUrl },
    } = supabase.storage.from("competition-images").getPublicUrl(filePath)

    console.log("[v0] Public URL generated:", publicUrl)

    return publicUrl
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Upload failed"
    console.error("[v0] Storage error:", errorMsg)
    return null
  }
}

export async function addBookmark(competitionId: string, userId: string): Promise<boolean> {
  try {
    console.log("[v0] Adding bookmark for competition:", competitionId, "user:", userId)

    const bookmarks = getLocalBookmarks()
    const key = `${competitionId}-${userId}`

    if (!bookmarks.includes(key)) {
      bookmarks.push(key)
      setLocalBookmarks(bookmarks)
      console.log("[v0] Bookmark saved successfully. Total bookmarks:", bookmarks.length)
    } else {
      console.log("[v0] Bookmark already exists")
    }

    return true
  } catch (error) {
    console.error("[v0] Error adding bookmark:", error)
    return false
  }
}

export async function removeBookmark(competitionId: string, userId: string): Promise<boolean> {
  try {
    console.log("[v0] Removing bookmark for competition:", competitionId, "user:", userId)

    let bookmarks = getLocalBookmarks()
    const key = `${competitionId}-${userId}`
    const beforeLength = bookmarks.length
    bookmarks = bookmarks.filter((b) => b !== key)

    if (beforeLength !== bookmarks.length) {
      setLocalBookmarks(bookmarks)
      console.log("[v0] Bookmark removed successfully")
    }

    return true
  } catch (error) {
    console.error("[v0] Error removing bookmark:", error)
    return false
  }
}

export async function isBookmarked(competitionId: string, userId: string): Promise<boolean> {
  try {
    const bookmarks = getLocalBookmarks()
    const key = `${competitionId}-${userId}`
    return bookmarks.includes(key)
  } catch (error) {
    console.error("[v0] Error checking bookmark:", error)
    return false
  }
}

export async function getBookmarkedCompetitionIds(userId: string): Promise<string[]> {
  try {
    const bookmarks = getLocalBookmarks()
    const prefix = `-${userId}`
    return bookmarks.filter((b) => b.endsWith(prefix)).map((b) => b.replace(prefix, ""))
  } catch (error) {
    console.error("[v0] Error getting bookmarks:", error)
    return []
  }
}

export async function addComment(competitionId: string, userId: string, content: string): Promise<boolean> {
  try {
    const comments = getLocalComments()
    const user = await getUserById(userId)

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      competition_id: competitionId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      users: user || undefined,
    }

    comments.push(newComment)
    setLocalComments(comments)
    return true
  } catch (error) {
    console.error("[v0] Error adding comment:", error)
    return false
  }
}

export async function getComments(competitionId: string): Promise<Comment[]> {
  try {
    const comments = getLocalComments()
    return comments
      .filter((c) => c.competition_id === competitionId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.error("[v0] Error getting comments:", error)
    return []
  }
}

export async function deleteComment(commentId: string, userId: string): Promise<boolean> {
  try {
    const comments = getLocalComments()
    const comment = comments.find((c) => c.id === commentId)

    if (!comment || comment.user_id !== userId) {
      return false
    }

    const filtered = comments.filter((c) => c.id !== commentId)
    setLocalComments(filtered)
    return true
  } catch (error) {
    console.error("[v0] Error deleting comment:", error)
    return false
  }
}

async function getUserById(userId: string): Promise<User | null> {
  if (typeof window !== "undefined") {
    const userStr = sessionStorage.getItem("user_info")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.id === userId) {
          return user
        }
      } catch (e) {
        // Continue
      }
    }
  }

  return {
    id: userId,
    email: "",
    name: "Pengguna",
    avatar_url: null,
    created_at: new Date().toISOString(),
  }
}

export async function deleteCompetition(competitionId: string, userId: string): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("competitions").delete().eq("id", competitionId).eq("user_id", userId)

  return !error
}
