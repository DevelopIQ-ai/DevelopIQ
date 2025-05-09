"use client"

import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { createClient } from '@supabase/supabase-js'

const WaitlistSuccess = () => (
    <div className="flex flex-col items-center justify-center">
        <div className="inline-block animate-fade-in bg-[#E86C24] text-white px-8 py-4 rounded-lg text-center transition-all duration-500 mx-auto">
            <p className="text-lg font-semibold">
            You&apos;re in! DevelopIQ is excited to build the future, together 🙌
            </p>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto my-3">You have successfully joined the waitlist. We will notify you on our progress.</p>
    </div>
)

export function JoinWaitlist({ hasJoinedWaitlist, setHasJoinedWaitlist }: { hasJoinedWaitlist: boolean, setHasJoinedWaitlist: (hasJoinedWaitlist: boolean) => void }) {
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  useEffect(() => {
    // Check if user has already joined waitlist
    const joinedWaitlist = localStorage.getItem("hasJoinedWaitlist") === "true"
    setHasJoinedWaitlist(joinedWaitlist)
    
    // Function to handle storage event (for cross-tab/window updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hasJoinedWaitlist") {
        setHasJoinedWaitlist(e.newValue === "true")
      }
    }
    
    // Function to handle custom event (for same-page updates)
    const handleLocalUpdate = (e: CustomEvent) => {
      setHasJoinedWaitlist(e.detail.joined)
    }
    
    // Add event listeners
    window.addEventListener("storage", handleStorageChange)
    document.addEventListener("localWaitlistUpdate", handleLocalUpdate as EventListener)
    
    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      document.removeEventListener("localWaitlistUpdate", handleLocalUpdate as EventListener)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null)
    e.preventDefault()
    setLoading(true)
    
    // Email validation
    if (!email) {
      setError("Please enter your email address.")
      setLoading(false)
      return
    }
    
    // Validate email format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      // First check if email already exists
      const { data: existingEmails } = await supabase
        .from("Waitlist")
        .select("email")
        .eq("email", email)
      
      // If email already exists, just show success without trying to insert again
      if (existingEmails && existingEmails.length > 0) {
        setHasJoinedWaitlist(true)
        localStorage.setItem("hasJoinedWaitlist", "true")
        setLoading(false)
        return
      }
      
      // Generate a random numeric ID instead of using UUID
      const numericId = Math.floor(Math.random() * 1000000000) // Random 9-digit number
      
      // Add to Supabase
      const { error: supabaseError } = await supabase
        .from("Waitlist")
        .insert([{ id: numericId, email }])

      if (supabaseError) throw supabaseError

      // Set success state
      setHasJoinedWaitlist(true)
      
      // Store joined status in localStorage
      localStorage.setItem("hasJoinedWaitlist", "true")
      
      // Notify all components on this page by dispatching a custom event
      document.dispatchEvent(new CustomEvent("localWaitlistUpdate", { 
        detail: { joined: true }
      }))
    } catch (err) {
      console.error("Error adding to waitlist:", err)
      setError("Failed to join the waitlist. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }, [error])

  return (
    <>
        {hasJoinedWaitlist ? (
        <WaitlistSuccess />
        ) : (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-start items-center pt-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 w-full px-6 py-6 text-lg rounded-lg border border-input bg-background h-[48px] w-[340px]"
                disabled={loading}
            />
            <Button 
                type="submit" 
                className="bg-[#E86C24] hover:bg-[#E86C24]/90 text-white px-6 py-6 text-lg font-semibold rounded-lg"
                disabled={loading}
            >
                {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                </>
                ) : (
                "Join the Waitlist"
                )}
            </Button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {/* <p className="text-sm text-muted-foreground max-w-2xl mx-auto my-3">Join our waitlist to stay updated on our progress</p> */}
        </>
        )}
    </>
  )
}

