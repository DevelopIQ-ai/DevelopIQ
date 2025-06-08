"use client"

import { useEffect, useState } from "react"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Box } from "@/components/ui/box"
import { useContactForm } from "@/hooks/useContactForm"

export default function Contact() {
  const { sendContactForm, loading, error, isSubmitted } = useContactForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendContactForm(formData);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col px-4">
        <Box>
          <div className="text-center py-8">
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight">
              GET IN TOUCH
              <div className="flex items-center justify-center gap-1">
                <div className="relative">
                  <span className="relative z-10">WE&apos;D LOVE TO HEAR FROM YOU.</span>
                  <div className="absolute bottom-1.5 left-0 w-full h-[45%] bg-[#e86c24] z-[1]"></div>
                </div>
              </div>
            </h1>
            
            <p className="font-mono mt-8 text-lg">
              TELL US ABOUT YOUR PROJECT
            </p>
          </div>
        </Box>

        <Box variant="blank" className="mt-16 mb-72 md:mb-32">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {isSubmitted ? (
              <div className="text-center">
                <h3 className="font-mono text-2xl mb-4">THANK YOU!</h3>
                <p className="font-mono">We&apos;ve received your message and will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="font-mono text-sm block">
                      FIRST NAME
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-none border-2 border-black bg-background px-4 py-2 font-mono focus:outline-none focus:border-[#e86c24]"
                      placeholder="John"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="font-mono text-sm block">
                      LAST NAME
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-none border-2 border-black bg-background px-4 py-2 font-mono focus:outline-none focus:border-[#e86c24]"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="font-mono text-sm block">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-none border-2 border-black bg-background px-4 py-2 font-mono focus:outline-none focus:border-[#e86c24]"
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="font-mono text-sm block">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-none border-2 border-black bg-background px-4 py-2 font-mono focus:outline-none focus:border-[#e86c24]"
                    placeholder="Tell us about your project..."
                  />
                </div>
                
                {error && (
                  <div className="p-4 font-mono text-sm border-2 border-red-500 bg-red-50 text-red-500">
                    There was an error sending your message. Please try again.
                  </div>
                )}
                
                <div className="text-center">
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    size="large" 
                    disabled={loading}
                    className="font-mono"
                  >
                    {loading ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Box>
      </main>
      <div className="w-full h-48 flex items-center">
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

