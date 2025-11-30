"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { useAuth } from "@/lib/auth-context"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { CompetitionCard } from "@/components/competition-card"
import { getSupabaseClient, type Competition } from "@/lib/supabase"
import { User, Mail, Calendar, LogOut, Plus, Trophy, Edit2, X, Check } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout, updateUserName } = useAuth()
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.name || "")
  const [isSavingName, setIsSavingName] = useState(false)

  const { data: myCompetitions, isLoading: competitionsLoading } = useSWR(
    user ? `my-competitions-${user.id}` : null,
    async () => {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from("competitions")
        .select("*, categories(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
      return data as Competition[]
    },
  )

  const handleSaveName = async () => {
    if (!newName.trim() || !user) return
    setIsSavingName(true)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("users").update({ name: newName.trim() }).eq("id", user.id)

      if (!error) {
        await updateUserName(newName.trim())
        setIsEditingName(false)
      } else {
        alert("Gagal mengupdate nama")
      }
    } catch (error) {
      console.error("[v0] Update name error:", error)
    } finally {
      setIsSavingName(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Profil" showBack={false} />
        <div className="mx-auto max-w-lg px-4 py-6">
          <Skeleton className="h-48 rounded-xl mb-6" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Profil" showBack={false} />
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Belum Masuk</h2>
          <p className="text-muted-foreground mb-6">Masuk untuk upload info lomba dan kelola lomba Anda</p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Profil" showBack={false} />

      <div className="mx-auto max-w-lg px-4 py-6">
        {/* User Info */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {(newName || user.name).charAt(0).toUpperCase()}
                  </span>
                </div>
                {isEditingName ? (
                  <div className="flex-1 space-y-2">
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama baru..." />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveName} disabled={isSavingName}>
                        <Check className="h-3 w-3 mr-1" />
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditingName(false)
                          setNewName(user.name)
                        }}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
              {!isEditingName && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditingName(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>
                Bergabung sejak{" "}
                {new Date(user.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </span>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link href="/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Lomba
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Competitions */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Lomba Saya
          </h3>
        </div>

        {competitionsLoading ? (
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : myCompetitions && myCompetitions.length > 0 ? (
          <div className="grid gap-4">
            {myCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">Belum Ada Lomba</h4>
              <p className="text-muted-foreground text-sm mb-4">Anda belum menambahkan info lomba apapun</p>
              <Button asChild>
                <Link href="/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Lomba
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
