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
                setError("Sorry, we only support properties in Indiana at this time.");
                setIsLoading(false);
                return;
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

    // Ensure address is in Indiana
    if (autocompleteInstance.current) {
      const place = autocompleteInstance.current.getPlace();
      console.log("place", place);
      if (!place || !isAddressInIndiana(place)) {
        setError("Sorry, we only support properties in Indiana at this time.");
        setIsLoading(false);
        return;
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
          <div>
            <h1 className="text-2xl font-bold text-center">
              Enter your property address to begin
            </h1>
            <p className="text-xs text-gray-500 text-center mt-1">
              *We only support properties in Indiana at this time.
            </p>
          </div>
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
          className="rounded-xl overflow-hidden shadow-md mt-12 w-full aspect-square sm:h-[600px] sm:w-[600px]"
          style={{
            backgroundColor: "#ffffff",
          }}
        ></div>
      </main>
    </div>
  )
}