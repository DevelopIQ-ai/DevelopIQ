"use client"

import Link from "next/link"
import { Clock, Search, Zap, MousePointer } from "lucide-react"
import { CalendarButton } from "@/components/calendar-button"
import { useEffect, useRef } from "react"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { FeatureCard } from "@/components/feature-card"
import { CarouselImage } from "@/components/carousel-image"

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

  const carouselImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rose-ZQTzVi9ahKDc5ATRSF6DKJVXR0vl4s.png",
      alt: "Rose-Hulman"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thompsonthrift-6ef1QqM6OIUNoaNE2MjQWW2aic7eX6.png",
      alt: "Thompson Thrift"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/envoy-5xqmEFuIKXq7oapYzMCc5khDDV4HSD.png",
      alt: "Envoy"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cornell-HhYDsU2FCYvphKu1RDevOIkmCfUP6U.png",
      alt: "Cornell University"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tesla-cPt9iXNojJWWf9sMgmpQVN2rNyXt9k.png",
      alt: "Tesla"
    },
    {
      src: "/images/uf.png",
      alt: "University of Florida"
    },
    {
      src: "/images/xrph.png",
      alt: "XRP Healthcare"
    },
    {
      src: "/images/um.png",
      alt: "University of Miami"
    },
  ];

  const featureCards = [
    {
      title: "Get reports of aggregated public information instantly",
      description: "Access comprehensive property data in seconds",
      icon: <Zap className="h-6 w-6 text-primary" />
    },
    {
      title: "Never Miss a data point",
      description: "Our AI ensures complete coverage of all relevant information",
      icon: <Search className="h-6 w-6 text-primary" />
    },
    {
      title: "Save hours that you can spend on assessing more properties",
      description: "Focus on analysis, not data gathering",
      icon: <Clock className="h-6 w-6 text-primary" />
    },
    {
      title: "Interact with your data seamlessly",
      description: "Intuitive interface for exploring property information",
      icon: <MousePointer className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col opacity-0 animate-fade-in">

      <NavBar />
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
              <Link href={process.env.NEXT_PUBLIC_MODE === "demo" ? "/demo" : "/search"}>
                <Button className="bg-[#E86C24] hover:bg-[#E86C24]/90 text-white px-12 py-6 text-lg font-semibold h-[60px] w-[240px] rounded-lg">
                  {process.env.NEXT_PUBLIC_MODE === "demo" ? "See Demo" : "Get Started"}
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
                  {carouselImages.map((image, index) => (
                    <CarouselImage key={index} {...image} />
                  ))}
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
              {featureCards.map((card, index) => (
                <FeatureCard key={index} {...card} />
              ))}
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
              <span className="text-primary">Millions of Insights</span>
            </h2>
            <div className="p-px">
            <Link href={process.env.NEXT_PUBLIC_MODE === "demo" ? "/demo" : "/search"}>
                <Button className="bg-[#E86C24] hover:bg-[#E86C24]/90 text-white px-12 py-6 text-lg font-semibold h-[60px] w-[240px] rounded-lg">
                  {process.env.NEXT_PUBLIC_MODE === "demo" ? "See Demo" : "Get Started"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

