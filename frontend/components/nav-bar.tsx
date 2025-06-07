import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import CalendlyButton from "./calendly-button"
import { useState, useEffect } from "react"
import { X, Menu } from "lucide-react"
import { Box } from "./ui/box"

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
    <div className="w-full p-4">
      <Box>
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <div className="w-full flex justify-between items-center">
            <Link href="/">
              <Image src="/logos/developiq_logo_large.png" alt="DevelopIQ Logo" width={150} height={50} />
            </Link>
            {isMobile && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Close menu" : "Open menu"}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                {isExpanded ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
          
          {(!isMobile || isExpanded) && (
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Link href="/" className="text-sm md:mr-4 font-mono">
                  Home
                </Link>
                <Link href="/blog" className="text-sm md:mr-4 font-mono">
                  Blog
                </Link>
                <Link href="/pricing" className="text-sm md:mr-4 font-mono">
                  Pricing
                </Link>
                <div className="md:hidden">
                  <Link href="https://zcal.co/i/BT5kddcb" target="_blank" rel="noopener noreferrer" className="text-sm font-mono">
                    Schedule a Call
                  </Link>
                </div>
                <div className="md:hidden">
                  <Link href="/contact" className="text-sm font-mono">
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center items-center gap-4 mt-2 md:mt-0">
                <CalendlyButton size="small" />
                <Link href="/contact">
                  <Button 
                    size="small"
                    variant="secondary"
                  >
                    <span>Talk to Sales</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Box>
    </div>
  )
}
