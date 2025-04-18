/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Newspaper, Check, AlertCircle } from "lucide-react"
import "@/styles/report.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRequestForLocation } from "@/hooks/useRequestForLocation"

export function NewsArticlesFallbackTab() {
  const [email, setEmail] = useState("")
  const { sendLocationRequest, loading, error, isSubmitted } = useRequestForLocation()
  
  const sampleSections = [
    {
      title: "News Articles",
      icon: <Newspaper className="h-5 w-5 text-primary" />,
      datapoints: ["News Articles Relevant to the Area", "Trusted Sources & Links", "Articles Published in the Last 6 Months"]
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = localStorage.getItem("propertyAddress") || "";
    await sendLocationRequest({ location: address, email: email })
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section - Available Data */}
        <div className="rounded-lg border bg-card shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Available in Our Reports</h2>
          <div className="space-y-6">
            {sampleSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-lg font-medium">{section.title}</h3>
                </div>
                <ul className="pl-7 grid md:grid-cols-2 grid-cols-1 gap-2">
                  {section.datapoints.map((datapoint) => (
                    <li key={datapoint} className="flex items-center gap-2 text-sm mb-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{datapoint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Request Form */}
        <div className="rounded-lg border bg-card shadow-sm p-6 flex flex-col justify-start">
          <div className="mx-auto w-full">
            <h2 className="text-xl font-semibold mb-2">Request This Location</h2>
            <p className="text-gray-600 mb-6">
              If you&apos;re interested in getting this report once we support this area, please enter your email below
            </p>
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Keep Me Updated"
                  )}
                </Button>
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
              </form>
            ) : (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle>Thank you!</AlertTitle>
                <AlertDescription>
                  We&apos;ll notify you when this location becomes available.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}