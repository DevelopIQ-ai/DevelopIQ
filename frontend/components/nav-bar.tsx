import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export const NavBar = () => {
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm header-nav">
      <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-sm" />
          </div>
          <span className="font-medium">DevelopIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>
          <a
            href="mailto:kushbhuwalka@gmail.com"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
          >
            Contact Us
          </a>
      </div>
    </header>
  )
}
