"use client"

import { Zap, Users, ArrowRight } from "lucide-react"
import "@/styles/animations.css"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"

export default function WhyYouNeedUs() {
    const points = [
      {
        title: "Real Estate is changing with AI",
        description: "AI is transforming how real estate firms work, creating new competitive advantages",
        icon: <Zap className="w-12 h-12 text-blue-600" />,
        color: "bg-blue-50",
        borderColor: "border-black"
      },
      {
        title: "Big players are investing heavily",
        description: "Larger companies hire teams of AI engineers, spending millions on R&D",
        icon: <Users className="w-12 h-12 text-green-600" />,
        color: "bg-green-50",
        borderColor: "border-black"
      },
      {
        title: "Small firms get left behind",
        description: "Smaller and mid-sized companies can't afford these resources.",
        icon: <ArrowRight className="w-12 h-12 text-red-600" />,
        color: "bg-red-50",
        borderColor: "border-black"
      },
      {
        title: "We bridge the gap",
        description: "We offer quick custom solutions to keep you in the competition.",
        icon: <Brain className="w-12 h-12 text-purple-600" />,
        color: "bg-purple-50",
        borderColor: "border-black"
      }
    ];
  
    return (
      <div className="max-w-6xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-64 perspective-1000 group"
            >
              {/* Flip card container - preserves 3D */}
              <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                
                {/* Front of card */}
                <div className={`absolute w-full h-full ${point.color} border-2 ${point.borderColor} rounded-xl shadow-md backface-hidden flex flex-col items-center justify-center p-6`}>
                  <div className="mb-4">
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center">{point.title}</h3>
                </div>
                
                {/* Back of card */}
                <div className={`absolute w-full h-full bg-white border-2 ${point.borderColor} rounded-xl shadow-md backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6`}>
                  <h3 className="text-xl font-bold text-center mb-4">{point.title}</h3>
                  <p className="text-gray-700 text-center">{point.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }