"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import "@/styles/report.css";
import { NavBar } from "@/components/nav-bar";

// Sample conversation starters for property addresses
const conversationStarters = [
  {
    id: 1,
    propertyAddress: "7315 Hwy 311, Sellersburg, IN 47172, USA",
    propertyType: "Vacant Land Commercial",
  },
  {
    id: 2,
    propertyAddress: "1206 W 186th St, Westfield, IN 46074, USA",
    propertyType: "Residential",
  },
  {
    id: 3,
    propertyAddress: "238 Easy St, Bargersville, IN 46106, USA",
    propertyType: "Residential",
  },
];

// Helper to load Google Maps script
const loadGoogleMapsScript = (callback: () => void) => {
  const existingScript = document.getElementById("google-maps-script");
  if (existingScript) {
    if (window.google?.maps) {
      callback();
    } else {
      existingScript.addEventListener("load", callback);
    }
    return;
  }
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // ensure this is set correctly
  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.body.appendChild(script);
};

export default function Demo() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Function to geocode address and update map location
  const updateMapLocation = (addressToGeocode: string) => {
    if (!geocoderRef.current && window.google?.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    if (geocoderRef.current && mapRef.current) {
      geocoderRef.current.geocode({ address: addressToGeocode }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          // Center the map on the new location
          mapRef.current?.setCenter(location);
          // Add or update marker
          if (markerRef.current) {
            markerRef.current.setPosition(location);
          } else {
            markerRef.current = new window.google.maps.Marker({
              position: location,
              map: mapRef.current,
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    const existingUserId = localStorage.getItem("userId");
    if (!existingUserId) {
      const userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    const initializeMap = () => {
      if (window.google?.maps) {
        // Initialize the map with a default center
        mapRef.current = new window.google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            center: { lat: 37.7749, lng: -122.4194 }, // Default center
            zoom: 12,
            backgroundColor: "#ffffff",
          }
        );
      }
    };
    loadGoogleMapsScript(() => {
      initializeMap();
    });
    return () => {
      if (autocompleteInstance.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance.current);
        autocompleteInstance.current = null;
      }
    };
  }, []);

  // Update map location when the address state changes
  useEffect(() => {
    if (address && window.google?.maps) {
      updateMapLocation(address);
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) {
      setError("Please select a valid address from the suggestions.");
      return;
    }
    localStorage.setItem("propertyAddress", address);
    localStorage.setItem("isDemo", "true");
    router.push("/report");
  };

  // ConversationStarter component for rendering each conversation button
  const ConversationStarter = ({
    propertyAddress,
    propertyType,
  }: {
    id: number;
    propertyAddress: string;
    propertyType: string;
  }) => {
    // Select icon based on propertyType
    const getIcon = () => {
      if (propertyType === "Building") {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clipRule="evenodd"
            />
          </svg>
        );
      }
      // Default icon for Residential
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    };

    return (
      <Button
        variant="outline"
        className={`rounded-full flex items-center px-4 py-2 gap-2 ${
          address === propertyAddress
            ? "bg-orange-50 border-orange-500 text-orange-700 hover:bg-orange-50"
            : "border-gray-200 hover:bg-gray-50 text-gray-800"
        } transition-colors text-left`}
        onClick={() => setAddress(propertyAddress)}
      >
        <div className={address === propertyAddress ? "text-orange-500" : "text-gray-400"}>
          {getIcon()}
        </div>
        <span>{propertyAddress}</span>
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] py-12 mt-20">
        <div className="w-full space-y-8 mb-12">
          <h1 className="text-2xl font-bold text-center">
            Select a property address to begin
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex justify-center flex-col items-center"
          >
            <div className="flex flex-wrap justify-center gap-4 mx-auto max-w-[1100px]">
              {conversationStarters.map((starter) => (
                <ConversationStarter key={starter.id} {...starter} />
              ))}
            </div>
            <Button
              type="submit"
              className="w-full max-w-[350px] h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
              disabled={!address}
            >
              Analyze Property
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Map container */}
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
  );
}