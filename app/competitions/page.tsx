"use client"

import { useState } from "react"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { CompetitionCard } from "@/components/competition-card"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { getSupabaseClient, type Competition } from "@/lib/supabase"
import { Search } from "lucide-react"

const fetcher = async () => {
  const supabase = getSupabaseClient()

  const { data } = await supabase
    .from("competitions")
    .select("*, categories(*)")
    .order("event_start", { ascending: true })

  return data as Competition[]
}

export default function CompetitionsPage() {
  const { data: competitions, error, isLoading } = useSWR("all-competitions", fetcher)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCompetitions = competitions?.filter(
    (comp) =>
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.organizer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Semua Lomba" />

      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari lomba atau penyelenggara..."
            className="pl-10 bg-secondary border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-destructive/10 p-4 text-center text-destructive">Gagal memuat data.</div>
        ) : filteredCompetitions?.length === 0 ? (
          <div className="rounded-xl bg-secondary p-8 text-center">
            <p className="text-muted-foreground">{searchQuery ? "Tidak ada hasil pencarian." : "Belum ada lomba."}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCompetitions?.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
