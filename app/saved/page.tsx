"use client"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { CompetitionCard } from "@/components/competition-card"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseClient, type Competition, getBookmarkedCompetitionIds } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Bookmark } from "lucide-react"

const fetcher = async (userId: string) => {
  if (!userId) return []

  const supabase = getSupabaseClient()

  try {
    // Get bookmarked competition IDs from local storage
    const competitionIds = await getBookmarkedCompetitionIds(userId)

    if (!competitionIds || competitionIds.length === 0) {
      console.log("[v0] No bookmarks found")
      return []
    }

    console.log("[v0] Fetching competitions:", competitionIds)

    // Fetch competition details from Supabase
    const { data: competitions, error: compError } = await supabase
      .from("competitions")
      .select("*, categories(*), users(*)")
      .in("id", competitionIds)
      .order("created_at", { ascending: false })

    if (compError) {
      console.error("[v0] Error fetching competitions:", compError)
      throw new Error(compError.message)
    }

    console.log("[v0] Competitions fetched:", competitions?.length || 0)
    return (competitions as Competition[]) || []
  } catch (error) {
    console.error("[v0] Fetcher error:", error)
    throw error
  }
}

export default function SavedPage() {
  const { user } = useAuth()

  const {
    data: competitions = [],
    error,
    isLoading,
    mutate,
  } = useSWR(user?.id ? `saved-${user.id}` : null, () => (user?.id ? fetcher(user.id) : Promise.resolve([])), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    onSuccess: (data) => {
      console.log("[v0] SWR onSuccess - competitions loaded:", data?.length || 0)
    },
    onError: (err) => {
      console.error("[v0] SWR onError:", err)
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Tersimpan" showBack={false} />

      <div className="mx-auto max-w-lg px-4 py-6">
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-destructive/10 p-4 text-center text-destructive">
            Gagal memuat data. Silakan coba lagi nanti.
          </div>
        ) : !competitions || competitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Belum Ada Lomba Tersimpan</h2>
            <p className="text-muted-foreground max-w-xs">
              Simpan lomba yang menarik agar kamu bisa menemukannya dengan mudah nanti.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                onBookmarkRemoved={() => {
                  console.log("[v0] Bookmark removed, refreshing list")
                  mutate()
                }}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
