"use client"

import { use } from "react"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { CompetitionCard } from "@/components/competition-card"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseClient, type Competition, type Category } from "@/lib/supabase"

const fetcher = async (categoryId: string) => {
  const supabase = getSupabaseClient()

  const [categoryRes, competitionsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("id", categoryId).single(),
    supabase
      .from("competitions")
      .select("*, categories(*)")
      .eq("category_id", categoryId)
      .order("event_start", { ascending: true }),
  ])

  return {
    category: categoryRes.data as Category,
    competitions: competitionsRes.data as Competition[],
  }
}

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, error, isLoading } = useSWR(`category-${id}`, () => fetcher(id))

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={data?.category?.name || "Kategori"} />

      <div className="mx-auto max-w-lg px-4 py-6">
        {data?.category && <p className="text-muted-foreground mb-6">{data.category.description}</p>}

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-destructive/10 p-4 text-center text-destructive">Gagal memuat data.</div>
        ) : data?.competitions?.length === 0 ? (
          <div className="rounded-xl bg-secondary p-8 text-center">
            <p className="text-muted-foreground">Belum ada lomba di kategori ini.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data?.competitions?.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} showCategory={false} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
