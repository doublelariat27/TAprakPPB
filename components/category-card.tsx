import type React from "react"
import Link from "next/link"
import { Code, Briefcase, Palette, FlaskConical, Trophy, PenTool } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/supabase"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  briefcase: Briefcase,
  palette: Palette,
  flask: FlaskConical,
  trophy: Trophy,
  "pen-tool": PenTool,
}

interface CategoryCardProps {
  category: Category
  competitionCount?: number
}

export function CategoryCard({ category, competitionCount }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Trophy

  return (
    <Link href={`/categories/${category.id}`}>
      <Card
        className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
        style={{
          borderColor: `${category.color}20`,
        }}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: category.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
          </div>
          {competitionCount !== undefined && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              {competitionCount}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
