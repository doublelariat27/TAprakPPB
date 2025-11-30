"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient, type Category } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Loader2, CheckCircle, LogIn } from "lucide-react"

const fetchCategories = async () => {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data as Category[]
}

export default function AddCompetitionPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { data: categories } = useSWR("categories-list", fetchCategories)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    organizer: "",
    registration_start: "",
    registration_end: "",
    event_start: "",
    event_end: "",
    location: "",
    registration_link: "",
    prize: "",
    requirements: "",
    contact_info: "",
    image_url: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (
      !formData.title ||
      !formData.description ||
      !formData.category_id ||
      !formData.organizer ||
      !formData.registration_start ||
      !formData.registration_end ||
      !formData.event_start ||
      !formData.event_end ||
      !formData.prize ||
      !formData.registration_link ||
      !formData.image_url
    ) {
      setUploadError("Harap isi semua field yang wajib diisi (*)")
      return
    }

    setIsSubmitting(true)
    setUploadError(null)

    try {
      console.log("[v0] Saving competition with image_url:", formData.image_url)
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("competitions").insert([
        {
          ...formData,
          is_online: isOnline,
          location: isOnline ? "Online" : formData.location,
          user_id: user.id,
        },
      ])

      if (error) throw error

      console.log("[v0] Competition saved successfully")
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("[v0] Error adding competition:", error)
      const errorMessage = error instanceof Error ? error.message : "Gagal menambahkan lomba"
      setUploadError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Tambah Lomba" showBack={false} />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
        <BottomNav />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Tambah Lomba" showBack={false} />
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <LogIn className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Masuk Diperlukan</h2>
          <p className="text-muted-foreground mb-6">Anda harus masuk terlebih dahulu untuk menambahkan info lomba</p>
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Tambah Lomba" showBack={false} />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Berhasil!</h2>
          <p className="text-muted-foreground">Lomba berhasil ditambahkan. Mengalihkan ke beranda...</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Tambah Lomba" showBack={false} />

      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="text-muted-foreground mb-6">
          Bagikan informasi lomba agar lebih banyak orang dapat berpartisipasi.
        </p>

        {uploadError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-foreground">URL Gambar Poster *</h3>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm">
                  Link Gambar
                </Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL gambar poster dari internet. Pastikan URL dapat diakses publik.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Informasi Dasar</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Nama Lomba *</Label>
                <Input
                  id="title"
                  placeholder="Hackathon Indonesia 2025"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan tentang lomba ini..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleChange("category_id", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Penyelenggara *</Label>
                <Input
                  id="organizer"
                  placeholder="Nama organisasi/institusi"
                  value={formData.organizer}
                  onChange={(e) => handleChange("organizer", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Timeline</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg_start">Pendaftaran Buka *</Label>
                  <Input
                    id="reg_start"
                    type="date"
                    value={formData.registration_start}
                    onChange={(e) => handleChange("registration_start", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg_end">Pendaftaran Tutup *</Label>
                  <Input
                    id="reg_end"
                    type="date"
                    value={formData.registration_end}
                    onChange={(e) => handleChange("registration_end", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_start">Acara Mulai *</Label>
                  <Input
                    id="event_start"
                    type="date"
                    value={formData.event_start}
                    onChange={(e) => handleChange("event_start", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_end">Acara Selesai *</Label>
                  <Input
                    id="event_end"
                    type="date"
                    value={formData.event_end}
                    onChange={(e) => handleChange("event_end", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Lokasi</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_online">Lomba Online</Label>
                <Switch id="is_online" checked={isOnline} onCheckedChange={setIsOnline} />
              </div>

              {!isOnline && (
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi *</Label>
                  <Input
                    id="location"
                    placeholder="Nama tempat, kota"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required={!isOnline}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Informasi Tambahan</h3>

              <div className="space-y-2">
                <Label htmlFor="prize">Hadiah *</Label>
                <Input
                  id="prize"
                  placeholder="Total Rp 100 Juta"
                  value={formData.prize}
                  onChange={(e) => handleChange("prize", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Persyaratan</Label>
                <Textarea
                  id="requirements"
                  placeholder="Siapa yang boleh ikut, apa yang perlu disiapkan..."
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => handleChange("requirements", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_link">Link Pendaftaran *</Label>
                <Input
                  id="registration_link"
                  type="url"
                  placeholder="https://..."
                  value={formData.registration_link}
                  onChange={(e) => handleChange("registration_link", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_info">Kontak</Label>
                <Input
                  id="contact_info"
                  placeholder="Email atau nomor telepon"
                  value={formData.contact_info}
                  onChange={(e) => handleChange("contact_info", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Tambah Lomba"
            )}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
