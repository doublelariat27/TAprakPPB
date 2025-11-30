"use client"

import { BottomNav } from "@/components/bottom-nav"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Target, Heart, Github, Mail, Globe, Smartphone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Tentang" showBack={false} />

      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* App Info */}
        <div className="text-center py-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            <span className="text-primary">Lomba</span>Ku
          </h1>
          <p className="text-muted-foreground">Versi 1.0.0</p>
        </div>

        {/* Description */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Tentang Aplikasi</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              LombaKu adalah platform informasi jadwal lomba dan kompetisi terlengkap di Indonesia. Aplikasi ini
              membantu kamu menemukan berbagai kompetisi mulai dari hackathon, business case, olimpiade sains, hingga
              lomba seni dan desain.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Fitur Utama</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Info Lomba Lengkap</p>
                  <p className="text-xs text-muted-foreground">
                    Informasi detail termasuk hadiah, timeline, dan persyaratan
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                  <Users className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Berbagi Informasi</p>
                  <p className="text-xs text-muted-foreground">Tambahkan info lomba agar lebih banyak orang tahu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20">
                  <Heart className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Simpan Favorit</p>
                  <p className="text-xs text-muted-foreground">Bookmark lomba yang menarik untuk akses cepat</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Smartphone className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Progressive Web App</p>
                  <p className="text-xs text-muted-foreground">Install di HP seperti aplikasi native</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Info */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Pengembang</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Developer Name</p>
                <p className="text-sm text-muted-foreground">Full Stack Developer</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Teknologi</h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PWA"].map((tech) => (
                <span key={tech} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Made with ❤️ in Indonesia
          <br />© 2025 LombaKu. All rights reserved.
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
