import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"

export const NavBar = () => {
  return (
    <header className="w-full mx-auto px-4 py-2 flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-sm header-nav shadow-sm">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image src="/logos/developiq_logo_large.png" alt="DevelopIQ Logo" width={150} height={50} />
        </Link>
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
