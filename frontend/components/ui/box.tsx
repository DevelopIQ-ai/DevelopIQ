"use client"

import * as React from "react"
import { X, CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "blank"
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const Icon = variant === "primary" ? X : CircleDot
    const iconColor = variant === "primary" ? "text-black" : "text-white fill-white"
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          variant === "primary" 
            ? "border-2 border-black bg-white" 
            : variant === "secondary"
            ? "bg-[#e86c24]"
            : "bg-white",
          className
        )}
        {...props}
      >
        {variant !== "blank" && (
          <div className="flex flex-col min-h-full">
            {/* Top row with icons */}
            <div className="flex justify-between">
              <Icon className={`p-2 h-8 w-8 ${iconColor}`} />
              <Icon className={`p-2 h-8 w-8 ${iconColor}`} />
            </div>

            {/* Content row */}
            <div className="px-6 md:px-12 flex-1">
              {children}
            </div>

            {/* Bottom row with icons */}
            <div className="flex justify-between mt-auto">
              <Icon className={`p-2 h-8 w-8 ${iconColor}`} />
              <Icon className={`p-2 h-8 w-8 ${iconColor}`} />
            </div>
          </div>
        )}
        
        {variant === "blank" && (
          <div className="px-6 md:px-12">
            {children}
          </div>
        )}
      </div>
    )
  }
)
Box.displayName = "Box"

export { Box }
