"use client"

import Link from "next/link"
import { Clock, Search, Zap, MousePointer } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { FeatureCard } from "@/components/feature-card"
import { CarouselImage } from "@/components/carousel-image"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

// Helper to load Google Maps script
const loadGoogleMapsScript = (callback: () => void) => {
  const existingScript = document.getElementById("google-maps-script")
  if (existingScript) {
    if (window.google?.maps) {
      callback()
    } else {
      existingScript.addEventListener("load", callback)
    }
    return
  }
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY // ensure this is set correctly
  const script = document.createElement("script")
  script.id = "google-maps-script"
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = callback
  document.body.appendChild(script)
}

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const autocompleteInput = useRef<HTMLInputElement>(null)
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    // Generate and store a UUID if it doesn't exist
    const existingUserId = localStorage.getItem("userId")
    if (!existingUserId) {
      const userId = uuidv4()
      localStorage.setItem("userId", userId)
    }

    const initializeMap = () => {
      if (window.google?.maps) {
        // Initialize the map with a default center
        mapRef.current = new window.google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            center: { lat: 39.7691, lng: -86.1580 }, // Default center; update as needed
            zoom: 12,
            backgroundColor: "#ffffff",
          }
        )
      }
    }

    const initializeAutocomplete = () => {
      if (autocompleteInput.current && window.google?.maps?.places) {
        autocompleteInstance.current = new window.google.maps.places.Autocomplete(
          autocompleteInput.current,
          {
            types: ["address"],
            componentRestrictions: { country: "us" },
            fields: ["formatted_address", "geometry", "address_components"],
          }
        )

        autocompleteInstance.current.addListener("place_changed", () => {
          const place = autocompleteInstance.current?.getPlace()
          if (place?.formatted_address) {
            if (autocompleteInstance.current) {
              if (!place || !isAddressInIndiana(place)) {
                localStorage.setItem("isAddressSupported", "false")
              } else {
                localStorage.setItem("isAddressSupported", "true")
              }
            }
            setAddress(place.formatted_address)
            if (place.geometry?.location && mapRef.current) {
              // Center the map on the selected location
              mapRef.current.setCenter(place.geometry.location)
              // Add or update marker
              if (markerRef.current) {
                markerRef.current.setPosition(place.geometry.location)
              } else {
                markerRef.current = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map: mapRef.current,
                })
              }
            }
          }
        })
      }
    }

    loadGoogleMapsScript(() => {
      initializeMap()
      initializeAutocomplete()
    })

    return () => {
      if (autocompleteInstance.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance.current)
        autocompleteInstance.current = null
      }
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

  // Add a function to check if address is in Indiana
  const isAddressInIndiana = (place: google.maps.places.PlaceResult): boolean => {
    if (!place.address_components) return false;
    
    // Find the state component
    const stateComponent = place.address_components.find(component => 
      component.types.includes("administrative_area_level_1")
    );

    // Check if the state is Indiana (IN)
    return stateComponent?.short_name === "IN" || stateComponent?.long_name === "Indiana";
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null)
    e.preventDefault()
    if (!address) {
      setError("Please select a valid address from the suggestions.")
      return
    }
    
    // Clear previous property data from localStorage
    // Keep only the userId
    const userId = localStorage.getItem("userId")
    localStorage.clear()
    if (userId) {
      localStorage.setItem("userId", userId)
    }
    
    // Set the new property address
    localStorage.setItem("propertyAddress", address)

    // Ensure address is in Indiana
    if (autocompleteInstance.current) {
      const place = autocompleteInstance.current.getPlace();
      console.log("place", place);

      const latitude = place.geometry?.location?.lat();
      const longitude = place.geometry?.location?.lng();
      localStorage.setItem("propertyLatitude", latitude?.toString() || "");
      localStorage.setItem("propertyLongitude", longitude?.toString() || "");
      
      if (!place || !isAddressInIndiana(place)) {
        localStorage.setItem("isAddressSupported", "false")
      } else {
        localStorage.setItem("isAddressSupported", "true")
      }
      const countyComponent = place.address_components?.find(component => 
        component.types.includes("administrative_area_level_2")
      );
      const county = countyComponent?.long_name || countyComponent?.short_name;
      localStorage.setItem("county", county || "");

      const stateComponent = place.address_components?.find(component => 
        component.types.includes("administrative_area_level_1")
      );
      const state = stateComponent?.long_name || stateComponent?.short_name;
      localStorage.setItem("state", state || "");
    }
    
    // test attom api call
    router.push("/report")
  }

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
          <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-16 md:py-8 mt-12 md:mt-0">
            <div className="flex flex-col items-center justify-center col-span-1">
              <div className="max-w-xl space-y-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
                  <span className="block text-left mb-2">Property Research</span>
                  <span className="block text-left animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent">
                    In Minutes Not Hours
                  </span>
                </h1>

                <p className="text-lg text-left text-muted-foreground max-w-2xl mx-auto">
                Everything you used to Google — in one click.
                </p>

                <div>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-4">
                  <input 
                    type="text"
                    ref={autocompleteInput}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter property address..."
                    className="flex-1 w-full px-6 py-6 text-lg rounded-lg border border-input bg-background h-[48px]"
                  />
                    <Button type="submit" className="bg-[#E86C24] hover:bg-[#E86C24]/90 text-white px-6 py-6 text-lg font-semibold rounded-lg">
                      {process.env.NEXT_PUBLIC_MODE === "demo" ? "See Demo" : "Get Started"}
                    </Button>
                  </form>
                </div>
                {error && <p className="text-red-500 text-left mt-2">{error}</p>}
              </div>
            </div>
            <div className="mt-12 md:mt-0 flex items-center justify-center col-span-1">
            <div
              id="map"
              className="rounded-xl overflow-hidden w-full aspect-square sm:h-[400px] sm:w-[400px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] max-h-[600px]"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 30px -2px rgba(232, 108, 36, 0.25), 0 6px 20px -4px rgba(232, 108, 36, 0.15)",
              }}
            ></div>
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

