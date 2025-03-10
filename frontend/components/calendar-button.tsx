"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function CalendarButton() {
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

