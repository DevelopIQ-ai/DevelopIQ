import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import CalendlyButton from "./calendly-button"
import { useState, useEffect } from "react"
import { X, Menu } from "lucide-react"

export const NavBar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Check on initial load
    checkScreenSize()
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize)
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <header className="w-full mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center md:fixed sticky top-0 left-0 right-0 z-50 bg-background backdrop-blur-sm header-nav shadow-sm">
      <div className="w-full flex justify-between items-center">
        <Link href="/">
          <Image src="/logos/developiq_logo_large.png" alt="DevelopIQ Logo" width={150} height={50} />
        </Link>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Close menu" : "Open menu"}
          >
            {isExpanded ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </div>
      
      {(!isMobile || isExpanded) && (
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
          <div className="flex flex-row items-center gap-4">
          <Link href="/" className="text-sm md:mr-4 text-black">
              Home
            </Link>
            <Link href="/blog" className="text-sm md:mr-4 text-black">
              Blog
            </Link>
          <Link href="/pricing" className="text-sm md:mr-4 text-black">
              Pricing
            </Link>
          </div>
          <div className="flex justify-center items-center gap-4 mt-2 md:mt-0">
            <CalendlyButton size="small" />
            <Link href="/contact">
              <Button 
                className="bg-[#ffffff] border-2 border-[#000000] hover:bg-[#000000] hover:text-white text-black px-4 py-4 text-sm font-semibold rounded-lg w-[180px]"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
