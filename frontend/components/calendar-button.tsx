"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function CalendarButton({ variant = "large" }: { variant?: "large" | "small" }) {
  if (variant === "small") {
    return (
      <Button
        className="bg-background hover:bg-background/90 text-foreground px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-lg border border-border h-10"
        asChild
      >
        <a href="https://cal.com/kushbhuwalka/developiq" target="_blank" rel="noopener noreferrer">
          <Calendar className="h-5 w-5" />
          Talk to a Founder
        </a>
      </Button>
    )
  }

  return (
    <Button
      className="bg-background hover:bg-background/90 text-foreground px-12 py-6 text-lg font-semibold flex items-center gap-2 h-[60px] w-[240px] rounded-lg border border-border"
      asChild
    >
      <a href="https://cal.com/kushbhuwalka/developiq" target="_blank" rel="noopener noreferrer">
        <Calendar className="h-5 w-5" />
        Talk to a Founder
      </a>
    </Button>
  )
}

