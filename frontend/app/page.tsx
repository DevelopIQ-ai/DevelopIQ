"use client"

import CalendlyButton from "@/components/calendly-button"
import { NavBar } from "@/components/nav-bar"
import { Box } from "@/components/ui/box"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col px-4">
        <Box>
          <div className="text-center py-8">
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight">
              AUTOMATE. ACCELERATE.
              <div className="flex items-center justify-center gap-1">
                <div className="relative">
                  <span className="relative z-10">BUILD FASTER.</span>
                  <div className="absolute bottom-1.5 left-0 w-full h-[45%] bg-[#e86c24] z-[1]"></div>
                </div>
              </div>
            </h1>
            
            <p className="font-mono mt-8 text-base sm:text-lg">
              DEVELOPIQ IS CHANGING THE WAY CONSTRUCTION FIRMS
              <br className="hidden sm:block" />
              <br className="block sm:hidden" />
              OPERATE IN THE AGE OF AI
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-28 mt-8">
              <div className="hidden md:block w-[200px]">
                <CalendlyButton size="large" />
              </div>
              <div className="md:hidden w-[200px]">
                <CalendlyButton size="small" />
              </div>
              <div className="hidden md:block w-[200px]">
                <Link href="/contact">
                  <Button variant="secondary" size="large" className="w-full">Talk to Sales</Button>
                </Link>
              </div>
              <div className="md:hidden w-[200px]">
                <Link href="/contact">
                  <Button variant="secondary" size="small" className="w-full">Talk to Sales</Button>
                </Link>
              </div>
            </div>

            <p className="font-mono mt-8 text-sm">
              TRUSTED BY [METRIC] TONS OF CONSTRUCTION FIRMS
            </p>
          </div>
        </Box>

        <Box variant="blank" className="mt-4 mb-4">
          <div className="text-center py-12">
            <h2 className="font-mono text-2xl md:text-3xl mb-12 text-black">
              INTEGRATE EVERY TOOL IN YOUR CONSTRUCTION ARSENAL
            </h2>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
              <div className="bg-white p-4 w-[100px] h-[100px] flex items-center justify-center border-2 border-black">
                <Image 
                  src="/logos/procore.png" 
                  alt="Procore logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="bg-white p-4 w-[100px] h-[100px] flex items-center justify-center border-2 border-black">
                <Image 
                  src="/logos/argus.png" 
                  alt="Argus logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="bg-white p-4 w-[100px] h-[100px] flex items-center justify-center border-2 border-black">
                <Image 
                  src="/logos/gmail.png" 
                  alt="Gmail logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="bg-white p-4 w-[100px] h-[100px] flex items-center justify-center border-2 border-black">
                <Image 
                  src="/logos/autodesk.png" 
                  alt="Autodesk logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="bg-white p-4 w-[100px] h-[100px] flex items-center justify-center border-2 border-black">
                <Image 
                  src="/logos/monday.png" 
                  alt="Monday.com logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <p className="font-mono text-black mt-8">[AND MANY MORE]</p>
          </div>
        </Box>

        <Box variant="secondary" className="my-4">
          <div className="text-center py-12">
            <h1 className="font-mono text-4xl md:text-5xl text-white mb-4">
              AUTOMATE THE ADMIN WORK
            </h1>
            <p className="font-mono text-xl text-white mb-16">
              Save your firm time with DevelopIQ
            </p>
            <div className="flex justify-center">
              <Image 
                src="/images/automation.png" 
                alt="Automation workflow diagram showing integration between Autodesk, Procore, Gmail, and Monday.com"
                width={1024}
                height={576}
                className="w-full max-w-4xl"
                priority
              />
            </div>
          </div>
        </Box>

        <div className="text-center mt-16 mb-4">
          <h1 className="font-mono text-4xl md:text-5xl mb-16">
            SOME THINGS WE CAN DO
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto md:mb-0">
            <Box variant="primary" className="relative">
              <div className="text-center mb-12">
                <h3 className="font-mono text-md">
                  AUTOMATED<br />SUBCONTRACTOR BIDDING
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 relative">
                <Image src="/logos/autodesk.png" alt="Autodesk" width={48} height={48} className="w-12 h-12 object-contain" />
                <div className="hidden sm:block bidirectional-arrow"></div>
                <div className="sm:hidden vertical-bidirectional-arrow"></div>
                <Image src="/logos/gmail.png" alt="Gmail" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
            </Box>

            <Box variant="primary" className="relative">
              <div className="text-center mb-12">
                <h3 className="font-mono text-md">
                  REAL-TIME CREW &<br />EQUIPMENT SCHEDULING
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 relative">
                <Image src="/logos/procore.png" alt="Procore" width={48} height={48} className="w-12 h-12 object-contain" />
                <div className="hidden sm:block bidirectional-arrow"></div>
                <div className="block sm:hidden vertical-bidirectional-arrow"></div>
                <Image src="/logos/monday.png" alt="Monday.com" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
            </Box>

            <Box variant="primary" className="relative">
              <div className="text-center mb-12">
                <h3 className="font-mono text-md">
                  AUTOMATED PROJECT<br />INVOICING
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 relative">
                <Image src="/logos/procore.png" alt="Procore" width={48} height={48} className="w-12 h-12 object-contain" />
                <div className="hidden sm:block bidirectional-arrow"></div>
                <div className="block sm:hidden vertical-bidirectional-arrow"></div>
                <Image src="/logos/argus.png" alt="Argus" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
            </Box>

            <Box variant="primary" className="relative">
              <div className="text-center mb-12">
                <h3 className="font-mono text-md">
                  CENTRALIZED<br />COMPLIANCE TRACKING
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 relative">
                <Image src="/logos/argus.png" alt="Argus" width={48} height={48} className="w-12 h-12 object-contain" />
                <div className="hidden sm:block bidirectional-arrow"></div>
                <div className="block sm:hidden vertical-bidirectional-arrow"></div>
                <Image src="/logos/monday.png" alt="Monday.com" width={48} height={48} className="w-12 h-12 object-contain" />
              </div>
            </Box>
          </div>
        </div>

        <Box variant="blank" className="mb-72 mt-0 sm:mb-16 md:mb-32 sm:mt-32">
          <div className="text-center py-8">
            <h1 className="font-mono text-4xl md:text-5xl mb-4">
              LET AI HANDLE THE HEAVY LIFTING
            </h1>
            <p className="font-mono text-lg mb-12">
              Schedule a discovery call so we can help you
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-28">
              <div className="hidden md:block w-[200px]">
                <CalendlyButton size="large" />
              </div>
              <div className="md:hidden w-[200px]">
                <CalendlyButton size="small" />
              </div>
              <div className="hidden md:block w-[200px]">
                <Link href="/contact">
                  <Button variant="secondary" size="large" className="w-full">Talk to Sales</Button>
                </Link>
              </div>
              <div className="md:hidden w-[200px]">
                <Link href="/contact">
                  <Button variant="secondary" size="small" className="w-full">Talk to Sales</Button>
                </Link>
              </div>
            </div>
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

