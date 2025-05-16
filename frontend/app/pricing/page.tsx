"use client"

import Link from "next/link"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"


export default function PricingPage() {
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <section
          className="flex flex-col justify-start px-4 min-h-screen section transition-all duration-500 mb-20"
        >
          <div className="w-full flex-1 max-w-7xl mx-auto px-4 py-16 md:py-8">
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mt-20">
                <span className="block text-left animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text py-1">
                  Pricing
                </span>
              </h1>

              <p className="text-lg text-left text-muted-foreground max-w-2xl my-6 text-[#000000]">
                We offer a range of pricing options to suit your needs.
              </p>

              <div className="w-full max-w-md mx-auto mt-8 rounded-lg border-2 border-black shadow-lg overflow-hidden bg-indigo-100">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-center mb-2">Outcome-Based Pricing</h2>
                  <p className="text-center text-muted-foreground mb-6">
                    We charge based on outcomes, not hours spent
                  </p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full mt-4"
                  >
                    <Link href="https://zcal.co/i/BT5kddcb" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full p-6 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 rounded-xl shadow-md border-2 border-black text-gray-700 font-medium hover:bg-gradient-to-r hover:from-orange-200 hover:via-amber-200 hover:to-orange-200 text-lg">
                      Talk to Us
                    </Button>
                    </Link>
                  </motion.div>
                  
                  <div className="mt-8 space-y-4">
                    {[
                      "Custom-made solutions",
                      "Tailored to your specific needs",
                      "Satisfaction guarantee",
                      "24/7 support",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

