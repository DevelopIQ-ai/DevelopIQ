"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { canFetchAttomData } from "@/lib/attom-data-fetcher"
import { NavBar } from "@/components/nav-bar"

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

export default function GetStarted() {
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
            center: { lat: 37.7749, lng: -122.4194 }, // Default center; update as needed
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
            fields: ["formatted_address", "geometry"],
          }
        )

        autocompleteInstance.current.addListener("place_changed", () => {
          const place = autocompleteInstance.current?.getPlace()
          if (place?.formatted_address) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null)
    e.preventDefault()
    if (!address) {
      setError("Please select a valid address from the suggestions.")
      return
    }
    setIsLoading(true)
    
    // Clear previous property data from localStorage
    // Keep only the userId
    const userId = localStorage.getItem("userId")
    localStorage.clear()
    if (userId) {
      localStorage.setItem("userId", userId)
    }
    
    // Set the new property address
    localStorage.setItem("propertyAddress", address)

    const canFetch = await canFetchAttomData(address)
    if (!canFetch) {
      setError("We are unable to process this address. Please try with a different address.")
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    // test attom api call
    router.push("/report")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <NavBar />

      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] py-12 mt-12">
        <div className="w-full max-w-md space-y-8 mb-12">
          <h1 className="text-2xl font-bold text-center">
            Enter your property address to begin
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              ref={autocompleteInput}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your property address"
              className="h-12 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
            />
            <Button
              type="submit"
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
              disabled={!address || isLoading}
            >
              {isLoading ? "Analyzing Property..." : "Analyze Property"}
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>
        {/* Map container with rounded corners */}
        <div
          id="map"
          className="rounded-xl overflow-hidden shadow-md mt-12"
          style={{
            height: "600px",
            width: "600px",
            backgroundColor: "#ffffff",
          }}
        ></div>
      </main>
    </div>
  )
}