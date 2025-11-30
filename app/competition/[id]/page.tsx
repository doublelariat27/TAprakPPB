"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  getSupabaseClient,
  type Competition,
  addComment,
  getComments,
  deleteComment,
  isBookmarked,
  addBookmark,
  removeBookmark,
} from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Loader2, MapPin, Calendar, Trophy, Users, MessageCircle, Bookmark, Share2, Trash2, X } from "lucide-react"
import { deleteCompetition } from "@/lib/supabase"

const fetchCompetition = async (id: string) => {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from("competitions").select("*, categories(*), users(*)").eq("id", id).single()
  return data as Competition
}

export default function CompetitionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const competitionId = params?.id as string

  const {
    data: competition,
    isLoading,
    error,
    mutate: mutateCompetition,
  } = useSWR(
    competitionId ? `competition-${competitionId}` : null,
    () => competitionId && fetchCompetition(competitionId),
  )

  const { data: comments = [], mutate: mutateComments } = useSWR(
    competitionId ? `comments-${competitionId}` : null,
    () => competitionId && getComments(competitionId),
  )

  const [isBookmarkedState, setIsBookmarkedState] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [isCommentingLoading, setIsCommentingLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
  const [commentError, setCommentError] = useState("")
  const [commentSuccess, setCommentSuccess] = useState(false)

  useEffect(() => {
    if (user && competitionId) {
      isBookmarked(competitionId, user.id).then(setIsBookmarkedState)
    }
  }, [user, competitionId])

  const handleBookmark = async () => {
    if (!user) {
      alert("Masuk terlebih dahulu untuk menandai sebagai favorit")
      return
    }

    console.log("[v0] Bookmark button clicked. Current state:", isBookmarkedState)
    console.log("[v0] User:", user.id, "Competition:", competitionId)

    try {
      if (isBookmarkedState) {
        console.log("[v0] Attempting to remove bookmark")
        await removeBookmark(competitionId, user.id)
        setIsBookmarkedState(false)
        console.log("[v0] Bookmark removed successfully")
      } else {
        console.log("[v0] Attempting to add bookmark")
        await addBookmark(competitionId, user.id)
        setIsBookmarkedState(true)
        console.log("[v0] Bookmark added successfully")
      }
    } catch (err) {
      console.error("[v0] Bookmark error details:", err)
      alert("Gagal mengubah status bookmark: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/competition/${competitionId}`
    const shareTitle = `Cek Lomba: ${competition?.title}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: competition?.description,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Share error:", err)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert("Link disalin ke clipboard!")
    }
  }

  const handleAddComment = async () => {
    if (!user) {
      alert("Masuk terlebih dahulu untuk memberikan komentar")
      return
    }

    const trimmedContent = commentContent.trim()
    if (!trimmedContent) {
      setCommentError("Komentar tidak boleh kosong")
      return
    }

    if (trimmedContent.length < 3) {
      setCommentError("Komentar minimal 3 karakter")
      return
    }

    if (trimmedContent.length > 500) {
      setCommentError("Komentar maksimal 500 karakter")
      return
    }

    setCommentError("")
    setIsCommentingLoading(true)

    try {
      const success = await addComment(competitionId, user.id, trimmedContent)

      if (success) {
        setCommentContent("")
        setCommentSuccess(true)
        setTimeout(() => setCommentSuccess(false), 3000)
        await mutateComments()
      } else {
        setCommentError("Gagal mengirim komentar. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("[v0] Comment error:", err)
      setCommentError("Terjadi kesalahan saat mengirim komentar")
    } finally {
      setIsCommentingLoading(false)
    }
  }

  const handleDeleteComment = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      const success = await deleteComment(deleteCommentId!, user.id)
      if (success) {
        setDeleteCommentId(null)
        await mutateComments()
      } else {
        alert("Gagal menghapus komentar")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCompetition = async () => {
    if (!user || competition?.user_id !== user.id) {
      alert("Anda tidak berhak menghapus postingan ini")
      return
    }

    if (confirm("Yakin ingin menghapus postingan ini?")) {
      setIsDeleting(true)
      try {
        const success = await deleteCompetition(competitionId, user.id)
        if (success) {
          alert("Postingan berhasil dihapus")
          router.push("/")
        } else {
          alert("Gagal menghapus postingan")
        }
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Detail Lomba" showBack />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
        <BottomNav />
      </div>
    )
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Detail Lomba" showBack />
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Lomba tidak ditemukan</h2>
          <p className="text-muted-foreground mb-6">Maaf, lomba yang Anda cari tidak tersedia</p>
          <Button asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Detail Lomba" showBack />

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Hero Image */}
        {competition.image_url && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
            <Image
              src={competition.image_url || "/placeholder.svg"}
              alt={competition.title}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>
        )}

        {/* Basic Info Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {competition.categories && (
                    <Badge variant="outline" className="text-xs">
                      {competition.categories.name}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground">{competition.title}</h1>
              </div>
              {user?.id === competition.user_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteCompetition}
                  disabled={isDeleting}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <p className="text-muted-foreground">{competition.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant={isBookmarkedState ? "default" : "outline"}
                size="sm"
                onClick={handleBookmark}
                className="flex-1 gap-2"
              >
                <Bookmark className="h-4 w-4" />
                {isBookmarkedState ? "Tersimpan" : "Simpan"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Bagikan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Dates */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Jadwal Penting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Pendaftaran Buka</p>
                <p className="font-semibold text-foreground">
                  {new Date(competition.registration_start).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Pendaftaran Tutup</p>
                <p className="font-semibold text-foreground">
                  {new Date(competition.registration_end).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Acara Mulai</p>
                <p className="font-semibold text-foreground">
                  {new Date(competition.event_start).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground mb-1">Acara Selesai</p>
                <p className="font-semibold text-foreground">
                  {new Date(competition.event_end).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Prize */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-semibold text-foreground">{competition.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Hadiah</p>
                <p className="font-semibold text-foreground">{competition.prize}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organizer Info */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Penyelenggara</p>
              <p className="font-semibold text-foreground">{competition.organizer}</p>
            </div>
            {competition.contact_info && (
              <div>
                <p className="text-sm text-muted-foreground">Kontak</p>
                <p className="font-semibold text-foreground">{competition.contact_info}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requirements */}
        {competition.requirements && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Persyaratan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{competition.requirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Registration Button */}
        <Button asChild size="lg" className="w-full">
          <a href={competition.registration_link} target="_blank" rel="noopener noreferrer">
            Daftar Sekarang
          </a>
        </Button>

        {/* Comments Section */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Komentar ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Tulis komentar..."
                    rows={3}
                    value={commentContent}
                    onChange={(e) => {
                      setCommentContent(e.target.value)
                      setCommentError("")
                    }}
                    className="bg-secondary border-border"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{commentContent.length}/500</span>
                  </div>
                </div>

                {commentError && (
                  <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{commentError}</span>
                  </div>
                )}

                {commentSuccess && (
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Komentar berhasil dikirim!</span>
                  </div>
                )}

                <Button onClick={handleAddComment} disabled={isCommentingLoading} className="w-full" size="sm">
                  {isCommentingLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Komentar"
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-3">Masuk untuk memberikan komentar</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Masuk</Link>
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 mt-4 pt-4 border-t border-border">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">Belum ada komentar</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-lg bg-secondary">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{comment.users?.name || "Pengguna"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {user?.id === comment.user_id && (
                        <div className="flex gap-2">
                          {deleteCommentId === comment.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteComment}
                                disabled={isDeleting}
                                className="text-destructive hover:bg-destructive/10 h-7"
                              >
                                {isDeleting ? "..." : "Ya"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteCommentId(null)}
                                className="h-7"
                              >
                                Batal
                              </Button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteCommentId(comment.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Delete comment"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-foreground text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
