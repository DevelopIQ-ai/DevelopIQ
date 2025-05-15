"use client"

import { useEffect, useRef } from "react"
import "@/styles/animations.css"
import { NavBar } from "@/components/nav-bar"
import { CarouselImage } from "@/components/carousel-image"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { RealEstateFlowchart } from "@/components/RealEstateFlowchart"
import Link from "next/link"
import CalendlyButton from "@/components/calendly-button"
import WhyYouNeedUs from "@/components/why-you-need-us"
import AutomationShowcase from "@/components/automation-showcase"
import WhyUs from "@/components/why-us"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Generate and store a UUID if it doesn't exist
    const existingUserId = localStorage.getItem("userId")
    if (!existingUserId) {
      const userId = uuidv4()
      localStorage.setItem("userId", userId)
    }

    // remove the contact form submitted flag when they re-visit the page
    const isFormSubmitted = localStorage.getItem("contactFormSubmitted") === "true"
    if (isFormSubmitted) {
      localStorage.removeItem("contactFormSubmitted")
    }
  }, [])

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
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thompsonthrift-6ef1QqM6OIUNoaNE2MjQWW2aic7eX6.png",
      alt: "Thompson Thrift"
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/envoy-5xqmEFuIKXq7oapYzMCc5khDDV4HSD.png",
      alt: "Envoy"
    },
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
          className="flex flex-col items-center justify-center text-center px-4 min-h-screen section opacity-0 transition-all duration-500"
        >
          <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-16 md:py-8 mt-2 md:mt-0">
            <div className="flex flex-col items-start justify-center col-span-1">
              <div className="w-full">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] mt-1 text-left">
                  <span className="block animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent py-1">
                    Affordable AI
                  </span>
                  <span className="block animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent py-1">
                    for Real Estate
                  </span>
                </h1>
              </div>

              <div className="w-full">
                <h4 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-[1.1] my-16 text-left">
                  <span className="block mb-2">Major players build AI <span className="text-[#e86c24]">in-house</span></span>
                  <span className="block mb-2">We bring those same tools to everyone else</span>
                </h4>
              </div>

              <div className="w-full flex flex-row gap-4">
                <CalendlyButton />
                <Link href="/contact">
                  <Button 
                    className="bg-[#ffffff] border-2 border-[#000000] hover:bg-[#000000] hover:text-white text-black px-6 py-6 text-lg font-semibold rounded-lg w-[248px]"
                  >
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center justify-center mt-0 md:mt-0 pb-10">
              <div className="w-full mx-auto">
                <RealEstateFlowchart />
              </div>
            </div>

          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[1] = el
            return undefined
          }}
          className="w-full py-20 flex items-center flex-col justify-center section opacity-0 transition-all duration-500 bg-gray-50"
        >
          <div className="max-w-4xl mx-auto w-full text-center mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1]">
              <span className="block py-1">
                Why DevelopIQ?
              </span>
            </h1>
          </div>

          <WhyYouNeedUs />
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[2] = el
            return undefined
          }}
          className="w-full py-20 flex items-center flex-col justify-center section opacity-0 transition-all duration-500"
        >
          <div className="max-w-4xl mx-auto w-full text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1]">
              <span className="block py-1">
                What We Automate (A Taste)
              </span>
            </h1>
          </div>

          <div className="flex items-center justify-center mt-0 md:mt-0 pb-10">
              <div className="w-full mx-auto">
                <AutomationShowcase />
              </div>
            </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[3] = el
            return undefined
          }}
          className="w-full py-20 flex items-center flex-col justify-center section opacity-0 transition-all duration-500 bg-gray-50"
        >
          <div className="max-w-4xl mx-auto w-full text-center mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1]">
              <span className="block py-1">
                Our DNA
              </span>
            </h1>
          </div>

          <WhyUs />
        </section>

        <section ref={(el) => {}} className="w-full pb-32 pt-12 flex items-center flex-col justify-center section">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1]">
                <span className="block py-1 pb-10">
                    Get in Touch
                </span>
            </h1>
            <div className="w-full flex flex-row justify-center gap-4">
                <CalendlyButton />
                <Link href="/contact">
                  <Button 
                    className="bg-[#ffffff] border-2 border-[#000000] hover:bg-[#000000] hover:text-white text-black px-6 py-6 text-lg font-semibold rounded-lg w-[248px]"
                  >
                    Talk to Sales
                  </Button>
                </Link>
              </div>
          </section>
        <section
          ref={(el) => {
            sectionRefs.current[4] = el
            return undefined
          }}
          className="w-full overflow-hidden py-20 bg-background border-t border-border section opacity-0 transition-all duration-500"
        >
          <p className="text-center text-sm text-muted-foreground mb-12">Built by Developers from</p>
          <div className="flex justify-center">
            <div className="flex items-center gap-16 px-4">
              {carouselImages.map((image, index) => (
                <CarouselImage key={index} {...image} />
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  )
}

