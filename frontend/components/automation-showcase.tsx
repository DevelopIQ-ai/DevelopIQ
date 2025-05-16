"use client"

import { Search, Zap, BookOpen, BarChart, Mail, Phone, Trello, Users, Table, Map, Loader } from "lucide-react"
import { useState } from "react"
import "@/styles/animations.css"
import { motion } from "framer-motion"

export default function AutomationShowcase() {
    const [selectedCategory, setSelectedCategory] = useState("featured");

    // Define a type for the automation items based on the existing arrays
    type AutomationItem = {
      catchyTitle: string;
      explanation: string;
      pain: string;
      solution: string;
      painIcon: JSX.Element;
      solutionIcon: JSX.Element;
      painColor: string;
      solutionColor: string;
      borderPain: string;
      borderSolution: string;
    };
    
    const featured: AutomationItem[] = [
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
        catchyTitle: "Document Intelligence",
        explanation: "Stop wasting hours on manual research. Our AI extracts key insights in seconds.",
        pain: "Reading large codebooks",
        solution: "Instant answers",
        painIcon: <BookOpen className="w-5 h-5 text-red-600" />,
        solutionIcon: <Search className="w-5 h-5 text-green-600" />,
        painColor: "bg-red-100",
        solutionColor: "bg-green-100",
        borderPain: "border-red-300",
        borderSolution: "border-green-300"
      },
      {
        catchyTitle: "Rapid Site Assessment",
        explanation: "Make informed go/no-go decisions instantly.",
        pain: "Conducting early site assessments",
        solution: "Fast site evaluator",
        painIcon: <Loader className="w-5 h-5 text-violet-600" />,
        solutionIcon: <Map className="w-5 h-5 text-lime-600" />,
        painColor: "bg-violet-100",
        solutionColor: "bg-lime-100",
        borderPain: "border-violet-300",
        borderSolution: "border-lime-300"
      },
    ];
    const developers: AutomationItem[] = [
      {
        catchyTitle: "Document Intelligence",
        explanation: "Stop wasting hours on manual research. Our AI extracts key insights in seconds.",
        pain: "Reading large codebooks",
        solution: "Instant answers",
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
    const brokers: AutomationItem[] = [
      {
        catchyTitle: "Call Intelligence Bot",
        explanation: "Let AI handle the tedious calls. Focus on meaningful conversations that matter.",
        pain: "Cold-call drudgery",
        solution: "Voice bot gathers broker intel",
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
        solution: "Mail-merge ready in a click",
        painIcon: <Users className="w-5 h-5 text-fuchsia-600" />,
        solutionIcon: <Zap className="w-5 h-5 text-cyan-600" />,
        painColor: "bg-fuchsia-100",
        solutionColor: "bg-cyan-100",
        borderPain: "border-fuchsia-300",
        borderSolution: "border-cyan-300"
      },
    ];
    const landAcquisition: AutomationItem[] = [
      {
        catchyTitle: "Rapid Site Assessment",
        explanation: "Make informed go/no-go decisions instantly.",
        pain: "Conducting early site assessments",
        solution: "Fast site evaluator",
        painIcon: <Loader className="w-5 h-5 text-violet-600" />,
        solutionIcon: <Map className="w-5 h-5 text-lime-600" />,
        painColor: "bg-violet-100",
        solutionColor: "bg-lime-100",
        borderPain: "border-violet-300",
        borderSolution: "border-lime-300"
      },
      {
        catchyTitle: "Easy LOIs",
        explanation: "Generate LOIs in seconds. No more back-and-forth with clients.",
        pain: "Manual LOI drafting",
        solution: "AI-drafted LOIs",
        painIcon: <Loader className="w-5 h-5 text-blue-600" />,
        solutionIcon: <Map className="w-5 h-5 text-yellow-600" />,
        painColor: "bg-blue-100",
        solutionColor: "bg-yellow-100",
        borderPain: "border-blue-300",
        borderSolution: "border-yellow-300"
      },
    ];
    
    // Use this type for the architects array
    const architects: AutomationItem[] = [
      {
        catchyTitle: "Codebook Research",
        explanation: "Stop wasting hours on manual research. Our AI extracts every data point in seconds.",
        pain: "Reading large codebooks",
        solution: "Instant data extraction",
        painIcon: <BookOpen className="w-5 h-5 text-yellow-600" />,
        solutionIcon: <Search className="w-5 h-5 text-orange-600" />,
        painColor: "bg-yellow-100",
        solutionColor: "bg-orange-100",
        borderPain: "border-yellow-300",
        borderSolution: "border-orange-300"
      },
      {
        catchyTitle: "Hefty Planning Processes",
        explanation: "Generated plans in seconds. No more manual drafting.",
        pain: "Slow planning processes",
        solution: "Auto-built plans",
        painIcon: <BarChart className="w-5 h-5 text-lime-600" />,
        solutionIcon: <Zap className="w-5 h-5 text-blue-600" />,
        painColor: "bg-lime-100",
        solutionColor: "bg-blue-100",
        borderPain: "border-lime-300",
        borderSolution: "border-blue-300"
      },
    ];
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
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
            <p className="font-medium text-gray-700 italic">Need something else? We&apos;ll build it.</p>
          </div>
        </motion.div>
      </div>
    );
  }