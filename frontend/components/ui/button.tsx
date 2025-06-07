import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleDot } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#e86c24] text-white border-2 border-[#e86c24] hover:bg-opacity-80 hover:border-[#ed8c4f]",
        secondary: "bg-white text-black border-2 border-black hover:text-opacity-80 hover:border-opacity-80 hover:bg-gray-100",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        small: "px-3 py-2",
        large: "px-8 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "large",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Only show circles for default variant */}
        {variant === 'default' && (
          <>
            <CircleDot className={cn(
              "absolute text-white fill-white",
              size === "small" ? "top-1 left-1" : "top-2 left-2"
            )} size={8} />
            <CircleDot className={cn(
              "absolute text-white fill-white",
              size === "small" ? "top-1 right-1" : "top-2 right-2"
            )} size={8} />
            <CircleDot className={cn(
              "absolute text-white fill-white",
              size === "small" ? "bottom-1 left-1" : "bottom-2 left-2"
            )} size={8} />
            <CircleDot className={cn(
              "absolute text-white fill-white",
              size === "small" ? "bottom-1 right-1" : "bottom-2 right-2"
            )} size={8} />
          </>
        )}
        
        {/* Content */}
        <span className={cn(
          "flex-1 text-center p-2",
          size === "small" ? "text-xs" : "text-base"
        )}>
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
