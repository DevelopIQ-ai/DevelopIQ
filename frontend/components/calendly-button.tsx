import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from './ui/button'; // Adjust this import path based on where your Button component is located

export default function CalendlyButton({ size = "large" }) {
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

    // Add Calendly script and CSS
    const script = document.createElement('script')
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    
    const link = document.createElement('link')
    link.href = "https://assets.calendly.com/assets/external/widget.css"
    link.rel = "stylesheet"
    
    document.head.appendChild(link)
    document.body.appendChild(script)
    
    return () => {
      // Clean up
      if (document.body.contains(script)) document.body.removeChild(script)
      if (document.head.contains(link)) document.head.removeChild(link)
    }
  }, [])

  // Function to open Calendly widget
  const openCalendly = () => {
    if ((window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: 'https://calendly.com/evan-developiq/15-minute-discovery-call'
      })
      return false
    }
  }

  return (
    <Button 
      onClick={openCalendly}
      className={`bg-[#000000] border-2 border-[#000000] hover:bg-[#E86C24]/90 hover:border-[#E86C24]/90 text-white font-semibold rounded-lg ${
        size === "small" 
          ? "w-[180px] p-4 text-sm" 
          : "w-[248px] px-6 py-6 text-lg"
      }`}
    >
      Book a 15-Minute Call
    </Button>
  )
}