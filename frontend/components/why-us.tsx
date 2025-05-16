"use client"

import { ArrowRight } from "lucide-react"
import "@/styles/animations.css"
import { motion } from "framer-motion"
import { Brain, FileSpreadsheet } from "lucide-react"
import { useEffect } from "react"

export default function WhyUs() {
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

    // Add CSS for 3D flip effect at beginning of component
  useEffect(() => {
    // Add CSS for 3D transformations
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 {
        perspective: 1000px;
      }
      .transform-style-3d {
        transform-style: preserve-3d;
      }
      .backface-hidden {
        backface-visibility: hidden;
      }
      .rotate-y-180 {
        transform: rotateY(180deg);
      }
      .group:hover .group-hover\\:rotate-y-180 {
        transform: rotateY(180deg);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
    return (
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <p className="text-xl font-medium italic">We are not a consulting firm. We are a product company.</p>
        </motion.div>
      </div>
    );
  }
  