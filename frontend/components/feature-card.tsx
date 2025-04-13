"use client"

import { Card } from "@/components/ui/card"

export function FeatureCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
  return (
    <Card className="flex flex-col items-start bg-primary/5 border-primary/10 p-8 space-y-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105">
        <div className="flex items-start gap-6">
            <div className="flex-shrink-0 mt-0.5">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-foreground">
                {title}
            </h3>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
            {description}
        </p>
    </Card>
  )
}

