"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { CompetitionCard } from "@/components/competition-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseClient, type Competition } from "@/lib/supabase"
import { Search, SearchX } from "lucide-react"

const fetchAllCompetitions = async () => {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from("competitions")
    .select("*, categories(*)")
    .order("created_at", { ascending: false })

  return data as Competition[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  const { data: competitions, isLoading } = useSWR("all-competitions-search", fetchAllCompetitions)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const filteredCompetitions = competitions?.filter((comp) => {
    const searchLower = debouncedQuery.toLowerCase()
    return (
      comp.title.toLowerCase().includes(searchLower) ||
      comp.description?.toLowerCase().includes(searchLower) ||
      comp.organizer?.toLowerCase().includes(searchLower) ||
      comp.categories?.name?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Cari Lomba" showBack />

      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari nama lomba, kategori, penyelenggara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 bg-secondary border-none text-base"
            autoFocus
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : debouncedQuery === "" ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Cari Lomba</h3>
            <p className="text-muted-foreground text-sm">
              Ketik untuk mencari lomba berdasarkan nama, kategori, atau penyelenggara
            </p>
          </div>
        ) : filteredCompetitions && filteredCompetitions.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Ditemukan {filteredCompetitions.length} hasil untuk "{debouncedQuery}"
            </p>
            <div className="grid gap-4">
              {filteredCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Tidak Ditemukan</h3>
            <p className="text-muted-foreground text-sm">Tidak ada lomba yang cocok dengan "{debouncedQuery}"</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
