import Link from "next/link"
import { Calendar, MapPin, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Competition } from "@/lib/supabase"

interface CompetitionCardProps {
  competition: Competition
  showCategory?: boolean
  onBookmarkRemoved?: () => void
}

export function CompetitionCard({ competition, showCategory = true, onBookmarkRemoved }: CompetitionCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const isRegistrationOpen = () => {
    const now = new Date()
    const start = new Date(competition.registration_start)
    const end = new Date(competition.registration_end)
    return now >= start && now <= end
  }

  return (
    <Link href={`/competition/${competition.id}`}>
      <Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={competition.image_url || "/placeholder.svg?height=200&width=400&query=competition event"}
            alt={competition.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <Badge
              variant={isRegistrationOpen() ? "default" : "secondary"}
              className={isRegistrationOpen() ? "bg-accent text-accent-foreground" : ""}
            >
              {isRegistrationOpen() ? "Pendaftaran Dibuka" : "Segera"}
            </Badge>
            {competition.is_featured && (
              <Badge variant="outline" className="border-primary text-primary">
                Featured
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
            {competition.title}
          </h3>

          {showCategory && competition.categories && (
            <Badge variant="secondary" className="mb-3 text-xs">
              {competition.categories.name}
            </Badge>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(competition.event_start)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{competition.is_online ? "Online" : competition.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="line-clamp-1 text-accent">{competition.prize}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
