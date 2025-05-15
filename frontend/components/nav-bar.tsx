import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import CalendlyButton from "./calendly-button"

export const NavBar = () => {
  return (
    <header className="w-full mx-auto px-4 py-2 flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-sm header-nav shadow-sm">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image src="/logos/developiq_logo_large.png" alt="DevelopIQ Logo" width={150} height={50} />
        </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-muted-foreground mr-2">
            Blog
          </Link>
          <CalendlyButton size="small" />
          <Link href="/contact">
            <Button 
              className="bg-[#ffffff] border-2 border-[#000000] hover:bg-[#000000] hover:text-white text-black px-4 py-4 text-sm font-semibold rounded-lg w-[180px]"
            >
              Talk to Sales
            </Button>
          </Link>
      </div>
    </header>
  )
}
