"use client"

import { Clock, Search, Zap, MousePointer } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import "@/styles/animations.css"
import { NavBar } from "@/components/nav-bar"
import { FeatureCard } from "@/components/feature-card"
import { CarouselImage } from "@/components/carousel-image"
import { v4 as uuidv4 } from "uuid"
import { JoinWaitlist } from "@/components/join-waitlist"

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false)

  useEffect(() => {
    // Generate and store a UUID if it doesn't exist
    const existingUserId = localStorage.getItem("userId")
    if (!existingUserId) {
      const userId = uuidv4()
      localStorage.setItem("userId", userId)
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

  useEffect(() => {
    const handleScroll = () => {
      const videoContainer = document.getElementById('video-container');
      if (videoContainer) {
        const rect = videoContainer.getBoundingClientRect();
        // Multiply by 2 to make the transition happen twice as fast
        const scrollPercentage = Math.max(0, Math.min(1, 2 * (1 - (rect.top / window.innerHeight))));

        // Start with 20 degree rotation, gradually becoming 0 as user scrolls
        const rotationDegree = 20 * (1 - scrollPercentage);
        videoContainer.style.transform = `perspective(1000px) rotateX(${rotationDegree}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on first render

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          className="flex flex-col items-center justify-center text-center px-4 min-h-screen section opacity-0 transition-all duration-500"
        >
          <div className="w-full flex-1 grid grid-cols-1 gap-4 max-w-7xl mx-auto px-4 py-16 md:py-8 mt-12 md:mt-0">
            <div className="flex flex-col items-center justify-center col-span-1">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.1] my-20">
                <span className="block text-left mb-2">Property Research</span>
                <span className="block text-left animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent py-1">
                  In Minutes Not Days
                </span>
              </h1>

              {/* <p className="text-lg text-left text-muted-foreground max-w-2xl mx-auto my-6 text-[#000000]">
                Everything you used to Google — in one click.
              </p> */}

              <JoinWaitlist hasJoinedWaitlist={hasJoinedWaitlist} setHasJoinedWaitlist={setHasJoinedWaitlist} />

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1] mt-20">
                <span className="block text-left animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent py-1">
                  10x Your Site Analysis
                </span>
              </h1>

              <div
                id="video-container"
                className="max-w-3xl mx-auto my-6 overflow-hidden rounded-xl shadow-lg border-2 border-border transition-transform duration-200"
                style={{
                  position: "relative",
                  paddingBottom: "40%",
                  height: 0,
                  width: "100%",
                  boxShadow: "0 8px 30px -2px rgba(232, 108, 36, 0.25), 0 6px 20px -4px rgba(232, 108, 36, 0.15)",
                  transformOrigin: "center bottom",
                  transform: "perspective(1000px) rotateX(20deg)" // Initial leaned-back state
                }}
              >
                <iframe
                  src="https://www.loom.com/embed/701c34cb2207483682970def5a7a9d71?sid=31ff5f0a-b5ca-4e61-95a1-320ea31f6991"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none"
                  }}
                ></iframe>
              </div>

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
              No More Sifting Through Messy Public Data
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
            <div className="w-full flex-1 grid grid-cols-1 gap-4 max-w-7xl mx-auto px-4 py-16 md:py-8 mt-12 md:mt-0">
              <div className="flex flex-col items-center justify-center col-span-1">
                <JoinWaitlist hasJoinedWaitlist={hasJoinedWaitlist} setHasJoinedWaitlist={setHasJoinedWaitlist} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

