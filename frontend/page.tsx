"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Clock, Search, Zap, MousePointer } from "lucide-react"
import { CalendarButton } from "@/components/calendar-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useRef } from "react"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
          } else {
            entry.target.classList.remove("active")
          }
        })
      },
      { threshold: 0.1 },
    )

    sectionRefs.current.forEach((section) => {
      if (section) {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          section.classList.add("active")
        }
        observer.observe(section)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page min-h-screen bg-background text-foreground flex flex-col opacity-0 animate-fade-in">
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
            href="mailto:kush@developiq.ai"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
          >
            Contact Us
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section
          ref={(el) => {
            sectionRefs.current[0] = el
            return undefined
          }}
          className="flex-1 flex flex-col items-center justify-center text-center px-4 min-h-screen pt-20 section opacity-0 transition-all duration-500"
        >
          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1]">
              <span className="block mb-2">Property Research</span>
              <span className="block animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent">
                In Minutes Not Hours
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your property research workflow with AI-powered insights
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <CalendarButton />
              <Link href="/report">
                <Button className="bg-[#E86C24] hover:bg-[#E86C24]/90 text-white px-12 py-6 text-lg font-semibold h-[60px] w-[240px] rounded-lg">
                  See Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[1] = el
            return undefined
          }}
          className="w-full overflow-hidden py-20 bg-background border-t border-border section opacity-0 transition-all duration-500"
        >
          <p className="text-center text-sm text-muted-foreground mb-12">Built by Developers from</p>
          <div className="flex">
            <div className="flex animate-scroll">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-32 px-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 relative">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rose-ZQTzVi9ahKDc5ATRSF6DKJVXR0vl4s.png"
                        alt="Rose-Hulman"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Rose-Hulman</span>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 relative">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thompsonthrift-6ef1QqM6OIUNoaNE2MjQWW2aic7eX6.png"
                        alt="Thompson Thrift"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Thompson Thrift</span>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 relative">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/envoy-5xqmEFuIKXq7oapYzMCc5khDDV4HSD.png"
                        alt="Envoy"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Envoy</span>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 relative">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cornell-HhYDsU2FCYvphKu1RDevOIkmCfUP6U.png"
                        alt="Cornell University"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Cornell</span>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 relative">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tesla-cPt9iXNojJWWf9sMgmpQVN2rNyXt9k.png"
                        alt="Tesla"
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Tesla</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[2] = el
            return undefined
          }}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-32 snap-start section opacity-0 transition-all duration-500"
        >
          <div className="max-w-4xl mx-auto w-full space-y-16">
            <h2 className="text-3xl sm:text-4xl font-medium text-center inline-block animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent">
              No more sifting through messy public data
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-primary/5 border-primary/10 p-8 space-y-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105">
                <Zap className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-medium text-foreground">
                  Get reports of aggregated public information instantly
                </h3>
                <p className="text-sm text-muted-foreground">Access comprehensive property data in seconds</p>
              </Card>

              <Card className="bg-primary/5 border-primary/10 p-8 space-y-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105">
                <Search className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Never Miss a data point</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI ensures complete coverage of all relevant information
                </p>
              </Card>

              <Card className="bg-primary/5 border-primary/10 p-8 space-y-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-medium text-foreground">
                  Save hours that you can spend on assessing more properties
                </h3>
                <p className="text-sm text-muted-foreground">Focus on analysis, not data gathering</p>
              </Card>

              <Card className="bg-primary/5 border-primary/10 p-8 space-y-4 transition-all duration-300 hover:bg-primary/10 hover:scale-105">
                <MousePointer className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Interact with your data seamlessly</h3>
                <p className="text-sm text-muted-foreground">Intuitive interface for exploring property information</p>
              </Card>
            </div>
          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[3] = el
            return undefined
          }}
          className="min-h-screen flex flex-col items-center justify-center px-4 py-32 bg-background section opacity-0 transition-all duration-500"
        >
          <div className="max-w-4xl mx-auto w-full text-center space-y-48">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Thousands of Datapoints,
              <br />
              <span className="text-primary">Millions of InSites</span>
            </h2>
            <div className="p-px">
              <Link href="/get-started">
                <Button className="bg-[#E86C24] hover:bg-[#E86C24]/90 text-white px-12 py-6 text-lg font-semibold h-[60px] w-[240px] rounded-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

