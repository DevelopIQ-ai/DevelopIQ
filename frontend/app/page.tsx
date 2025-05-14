"use client"

import { Clock, Search, Zap, MousePointer, BookOpen, BarChart, Mail, Phone, Trello, Users, Table, Map, Loader, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import "@/styles/animations.css"
import { NavBar } from "@/components/nav-bar"
import { FeatureCard } from "@/components/feature-card"
import { CarouselImage } from "@/components/carousel-image"
import { v4 as uuidv4 } from "uuid"
import { JoinWaitlist } from "@/components/join-waitlist"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Home, Brain, FileSpreadsheet } from "lucide-react"

function AutomationShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("featured");
  
  const developers = [
    {
      catchyTitle: "Document Intelligence",
      explanation: "Stop wasting hours on manual research. Our AI extracts key insights in seconds.",
      pain: "Reading large codebooks",
      solution: "Answers and citations in seconds",
      painIcon: <BookOpen className="w-5 h-5 text-red-600" />,
      solutionIcon: <Search className="w-5 h-5 text-green-600" />,
      painColor: "bg-red-100",
      solutionColor: "bg-green-100",
      borderPain: "border-red-300",
      borderSolution: "border-green-300"
    },
    {
      catchyTitle: "Automated Market Research",
      explanation: "Fresh insights delivered while you sleep. Wake up to data that's ready to use.",
      pain: "Manual market-research reports",
      solution: "Auto-built reports",
      painIcon: <BarChart className="w-5 h-5 text-orange-600" />,
      solutionIcon: <Zap className="w-5 h-5 text-blue-600" />,
      painColor: "bg-orange-100",
      solutionColor: "bg-blue-100",
      borderPain: "border-orange-300",
      borderSolution: "border-blue-300"
    },
    {
      catchyTitle: "Smart Email Assistant",
      explanation: "Never miss an important message again. Let AI handle the inbox sorting.",
      pain: "Inbox overload",
      solution: "AI email triage",
      painIcon: <Mail className="w-5 h-5 text-amber-600" />,
      solutionIcon: <Zap className="w-5 h-5 text-indigo-600" />,
      painColor: "bg-amber-100",
      solutionColor: "bg-indigo-100",
      borderPain: "border-amber-300",
      borderSolution: "border-indigo-300"
    },
    {
      catchyTitle: "Self-Organizing Tasks",
      explanation: "Work gets done, boards get updated. No manual tracking required.",
      pain: "Sticky task boards",
      solution: "Auto-updating trackers",
      painIcon: <Trello className="w-5 h-5 text-purple-600" />,
      solutionIcon: <Zap className="w-5 h-5 text-emerald-600" />,
      painColor: "bg-purple-100",
      solutionColor: "bg-emerald-100",
      borderPain: "border-purple-300",
      borderSolution: "border-emerald-300"
    },
    {
      catchyTitle: "Live Deal Tracking",
      explanation: "Real-time pipeline visibility without the data entry. See what matters most.",
      pain: "Deal pipeline spreadsheets",
      solution: "Smart dashboards",
      painIcon: <Table className="w-5 h-5 text-pink-600" />,
      solutionIcon: <BarChart className="w-5 h-5 text-sky-600" />,
      painColor: "bg-pink-100",
      solutionColor: "bg-sky-100", 
      borderPain: "border-pink-300",
      borderSolution: "border-sky-300"
    },
  ];
  const brokers = [
    {
      catchyTitle: "Call Intelligence Bot",
      explanation: "Let AI handle the tedious calls. Focus on meaningful conversations that matter.",
      pain: "Cold-call drudgery",
      solution: "Voice bot gathers broker intel, writes the summary for you",
      painIcon: <Phone className="w-5 h-5 text-rose-600" />,
      solutionIcon: <Zap className="w-5 h-5 text-teal-600" />,
      painColor: "bg-rose-100",
      solutionColor: "bg-teal-100",
      borderPain: "border-rose-300",
      borderSolution: "border-teal-300"
    },
    {
      catchyTitle: "One-Click Personalization",
      explanation: "Mass communications with a personal touch. Connect authentically at scale.",
      pain: "CRM busywork",
      solution: "Personalized mail-merge ready in a click",
      painIcon: <Users className="w-5 h-5 text-fuchsia-600" />,
      solutionIcon: <Zap className="w-5 h-5 text-cyan-600" />,
      painColor: "bg-fuchsia-100",
      solutionColor: "bg-cyan-100",
      borderPain: "border-fuchsia-300",
      borderSolution: "border-cyan-300"
    },
  ];
  const landAcquisition = [
    {
      catchyTitle: "Rapid Site Assessment",
      explanation: "Make informed go/no-go decisions instantly. Stop wasting time on dead-end properties.",
      pain: "Early site (go / no-go)",
      solution: "Fast site evaluator—zoning, comps, and risks in one view",
      painIcon: <Loader className="w-5 h-5 text-violet-600" />,
      solutionIcon: <Map className="w-5 h-5 text-lime-600" />,
      painColor: "bg-violet-100",
      solutionColor: "bg-lime-100",
      borderPain: "border-violet-300",
      borderSolution: "border-lime-300"
    },
  ];
  const architects = [];
  const featured = [];

  // Map category names to their respective arrays
  const categoryMap = {
    featured,
    developers,
    brokers,
    landAcquisition,
    architects,
  };

  // Get the currently selected list
  const currentList = categoryMap[selectedCategory as keyof typeof categoryMap] || [];

  // Create friendly display names for categories
  const categoryDisplayNames = {
    developers: "Developers",
    brokers: "Brokers",
    landAcquisition: "Land Acquisition",
    architects: "Architects",
    featured: "Featured"
  };

  return (
    <div className="grid grid-cols-1 gap-10 max-w-4xl mx-auto mt-10">
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.keys(categoryMap).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-black text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {categoryDisplayNames[category as keyof typeof categoryDisplayNames]}
          </button>
        ))}
      </div>

      {/* Display items from selected category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentList.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col items-center gap-4 p-4 border-2 border-black rounded-xl"
          >
            {/* Card Header with Title and Explanation */}
            <div className="w-full text-center mb-2">
              <h2 className="text-xl font-bold text-gray-800">{item.catchyTitle}</h2>
              <p className="text-gray-600 mt-1">{item.explanation}</p>
            </div>
            
            <div className="mt-auto flex-1 flex flex-col justify-end w-full">

            {/* Pain Point */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`relative z-10 w-full p-4 ${item.painColor} rounded-xl shadow-md border-4 border-white`}
              >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] bg-white rounded-lg shadow-sm`}>
                  <div className="flex-shrink-0">
                    {item.painIcon}
                  </div>
                </div>
                <h3 className="text-md font-bold text-gray-700">{item.pain}</h3>
              </div>
            </motion.div>

            {/* Arrow animation (vertical) */}
            <div className="flex items-center justify-center h-8">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>

            {/* Solution */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`relative z-10 w-full p-4 ${item.solutionColor} rounded-xl shadow-md border-4 border-white`}
              >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] bg-white rounded-lg shadow-sm`}>
                  <div className="flex-shrink-0">
                    {item.solutionIcon}
                  </div>
                </div>
                <h3 className="text-md font-bold text-gray-700">{item.solution}</h3>
              </div>
            </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* The final "We'll build it" item */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: currentList.length * 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto mt-6"
      >
        <div className="text-center p-4 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 rounded-xl shadow-md border-2 border-black">
          <p className="font-medium text-gray-700 italic">Need something else? We'll build it.</p>
        </div>
      </motion.div>
    </div>
  );
}

function RealEstateFlowchart() {
  return (
    <div className="flex flex-col items-center mt-20">
      {/* First Node - Property Search */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-[250px]"
      >
        <div className="flex items-center gap-3 p-3 bg-amber-100 rounded-xl shadow-md border-4 border-white">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
            <Home className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-amber-700">Property Search</h2>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full border border-amber-300 z-30"></div>
      </motion.div>
      {/* Animated Flowing Line 1 - Vertical */}
      <div className="w-[2px] h-[60px] mt-[1.5px] mb-[1.5px] overflow-hidden">
        <svg width="2" height="100%" preserveAspectRatio="none">
          <motion.path
            d="M1,0 L1,100"
            stroke="#F6D199"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -100 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "linear",
            }}
          />
        </svg>
      </div>
      {/* Second Node - Market Analysis */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative z-10 w-[250px]"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-purple-300 z-30"></div>
        <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-xl shadow-md border-4 border-white">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-purple-700">Market Analysis</h2>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rounded-full border border-purple-300 z-30"></div>
      </motion.div>
      {/* Animated Flowing Line 2 - Vertical */}
      <div className="w-[2px] h-[60px] mt-[1.5px] mb-[1.5px] overflow-hidden">
        <svg width="2" height="100%" preserveAspectRatio="none">
          <motion.path
            d="M1,0 L1,100"
            stroke="#D8B4FE"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -100 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "linear",
            }}
          />
        </svg>
      </div>
      {/* Third Node - Investment Report */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6 }}
        className="relative z-10 w-[250px]"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border border-green-300 z-30"></div>
        <div className="flex items-center gap-3 p-3 bg-green-100 rounded-xl shadow-md border-4 border-white">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-green-700">Investment Report</h2>
        </div>
      </motion.div>
    </div>
  )
}

function WhyUs() {
  const whyUsPoints = [
    {
      title: "Outcome pricing",
      description: "Pay for results, not hours.",
      icon: <FileSpreadsheet className="w-6 h-6 text-fuchsia-600" />
    },
    {
      title: "Real-estate + AI DNA",
      description: "A team of seasoned engineers and real estate developers.",
      icon: <Brain className="w-6 h-6 text-cyan-600" />
    },
    {
      title: "Proven quality",
      description: "Track record of excellence.",
      icon: <FileSpreadsheet className="w-6 h-6 text-lime-600" />
    },
    {
      title: "Future-ready",
      description: "Each small win stacks into a bigger AI edge.",
      icon: <ArrowRight className="w-6 h-6 text-indigo-600" />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {whyUsPoints.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col p-6 bg-white border-2 border-black rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold">{point.title}</h3>
            </div>
            <p className="text-gray-700 ml-16">{point.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false)

  useEffect(() => {
    // Generate and store a UUID if it doesn't exist
    const existingUserId = localStorage.getItem("userId")
    if (!existingUserId) {
      const userId = uuidv4()
      localStorage.setItem("userId", userId)
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

  useEffect(() => {
    const handleScroll = () => {
      const videoContainer = document.getElementById('video-container');
      if (videoContainer) {
        const rect = videoContainer.getBoundingClientRect();
        // Multiply by 2 to make the transition happen twice as fast
        const scrollPercentage = Math.max(0, Math.min(1, 2 * (1 - (rect.top / window.innerHeight))));

        // Start with 20 degree rotation, gradually becoming 0 as user scrolls
        const rotationDegree = 20 * (1 - scrollPercentage);
        videoContainer.style.transform = `perspective(1000px) rotateX(${rotationDegree}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on first render

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-4 py-16 md:py-8 mt-2 md:mt-0">
            <div className="flex flex-col items-start justify-center col-span-1">
              <div className="w-full">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] mt-1 text-left">
                  <span className="block animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent py-1">
                    Smarter Real Estate
                  </span>
                  <span className="block animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent py-1">
                    Starts Here
                  </span>
                </h1>
              </div>

              <div className="w-full">
                <h4 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-[1.1] my-16 text-left">
                  <span className="block mb-2">Use AI to slash hours and save money...</span>
                  <span className="block mb-2">Your competitors already are</span>
                </h4>
              </div>

              <div className="w-full flex flex-row gap-4">

              <Button 
                className="bg-[#000000] border-2 border-[#000000] hover:bg-[#E86C24]/90 hover:border-[#E86C24]/90 text-white px-6 py-6 text-lg font-semibold rounded-lg w-[248px]"
                >
                Book a 15-Minute Call
              </Button>
              <Button 
                className="bg-[#ffffff] border-2 border-[#000000] hover:bg-[#000000] hover:text-white text-black px-6 py-6 text-lg font-semibold rounded-lg w-[248px]"
                >
                Talk to Sales
              </Button>
                </div>
            </div>
            
            <div className="flex items-center justify-center mt-0 md:mt-0 pb-10">
              <div className="w-full mx-auto">
                <RealEstateFlowchart />
              </div>
            </div>

            {/* <JoinWaitlist hasJoinedWaitlist={hasJoinedWaitlist} setHasJoinedWaitlist={setHasJoinedWaitlist} /> */}


          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[1] = el
            return undefined
          }}
          className="w-full py-20 flex items-center flex-col justify-center section opacity-0 transition-all duration-500"
        >
          <div className="max-w-4xl mx-auto w-full text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1]">
              <span className="block py-1">
                What We Automate (A Taste)
              </span>
            </h1>
          </div>

          <div className="flex items-center justify-center mt-0 md:mt-0 pb-10">
              <div className="w-full mx-auto">
                <AutomationShowcase />
              </div>
            </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[2] = el
            return undefined
          }}
          className="w-full py-20 flex items-center flex-col justify-center section opacity-0 transition-all duration-500 bg-gray-50"
        >
          <div className="max-w-4xl mx-auto w-full text-center mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-[1.1]">
              <span className="block py-1">
                Why DevelopIQ
              </span>
            </h1>
          </div>

          <WhyUs />
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[3] = el
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

        
      </main>
    </div>
  )
}

