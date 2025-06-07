"use client"

import Link from "next/link"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Box } from "@/components/ui/box"
import CalendlyButton from "@/components/calendly-button"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col px-4">
        <Box>
          <div className="text-center py-8">
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight">
              OUTCOME-BASED PRICING
              <div className="flex items-center justify-center gap-1">
                <div className="relative">
                  <span className="relative z-10">BUILT FOR YOU.</span>
                  <div className="absolute bottom-1.5 left-0 w-full h-[45%] bg-[#e86c24] z-[1]"></div>
                </div>
              </div>
            </h1>
            
            <p className="font-mono mt-8 text-lg">
              WE CHARGE BASED ON OUTCOMES, NOT HOURS SPENT
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="hidden md:block">
                <CalendlyButton size="large" />
              </div>
              <div className="md:hidden">
                <CalendlyButton size="small" />
              </div>
              <div className="hidden md:block">
                <Link href="/contact">
                  <Button variant="secondary" size="large">CONTACT US</Button>
                </Link>
              </div>
              <div className="md:hidden">
                <Link href="/contact">
                  <Button variant="secondary" size="small">CONTACT US</Button>
                </Link>
              </div>
            </div>
          </div>
        </Box>

        <Box variant="blank" className="mt-16">
          <div className="text-center py-12">
            <h2 className="font-mono text-2xl md:text-3xl mb-12">
              WHAT YOU GET
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Box variant="primary" className="relative">
                <div className="text-center p-8">
                  <h3 className="font-mono text-lg mb-4">CUSTOM-MADE SOLUTIONS</h3>
                  <p className="font-mono text-sm">Tailored specifically to your construction workflow</p>
                </div>
              </Box>

              <Box variant="primary" className="relative">
                <div className="text-center p-8">
                  <h3 className="font-mono text-lg mb-4">SATISFACTION GUARANTEE</h3>
                  <p className="font-mono text-sm">Only pay for solutions that work for you</p>
                </div>
              </Box>

              <Box variant="primary" className="relative">
                <div className="text-center p-8">
                  <h3 className="font-mono text-lg mb-4">24/7 SUPPORT</h3>
                  <p className="font-mono text-sm">Round-the-clock assistance when you need it</p>
                </div>
              </Box>

              <Box variant="primary" className="relative">
                <div className="text-center p-8">
                  <h3 className="font-mono text-lg mb-4">FLEXIBLE INTEGRATION</h3>
                  <p className="font-mono text-sm">Works with your existing tools and processes</p>
                </div>
              </Box>
            </div>
          </div>
        </Box>

        <Box variant="blank" className="mt-16 mb-72 md:mb-32">
          <div className="text-center py-8">
            <h1 className="font-mono text-4xl md:text-5xl mb-4">
              LET&apos;S TALK ABOUT YOUR NEEDS
            </h1>
            <p className="font-mono text-lg mb-12">
              Schedule a discovery call so we can help you
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="hidden md:block">
                <CalendlyButton size="large" />
              </div>
              <div className="md:hidden">
                <CalendlyButton size="small" />
              </div>
              <div className="hidden md:block">
                <Link href="/contact">
                  <Button variant="secondary" size="large">CONTACT US</Button>
                </Link>
              </div>
              <div className="md:hidden">
                <Link href="/contact">
                  <Button variant="secondary" size="small">CONTACT US</Button>
                </Link>
              </div>
            </div>
          </div>
        </Box>
      </main>
      <div className="w-full h-48 flex items-center">
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

