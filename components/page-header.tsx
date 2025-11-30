"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  showBack?: boolean
}

export function PageHeader({ title, showBack = true }: PageHeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
        {showBack && (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
    </header>
  )
}
