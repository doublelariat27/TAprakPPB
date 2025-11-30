"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { InstallPWAButton } from "@/components/install-pwa-button"

interface HeaderProps {
  title?: string
  showSearch?: boolean
}

export function Header({ title = "LombaKu", showSearch = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <h1 className="text-xl font-bold text-foreground">
          <span className="text-primary">Lomba</span>Ku
        </h1>
        <div className="flex items-center gap-2">
          <InstallPWAButton />
          {showSearch && (
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Cari lomba...</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
