"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Wand2,
  Gauge,
  Home,
  Brain,
  FileSpreadsheet,
  ClipboardList,
  Settings2,
  TrendingUp,
} from "lucide-react";

/**
 * RealEstateFlowchart – cycles through several real-estate workflows.
 * Nodes are connected by pastel dots that match the connector colour
 * so the white circles no longer stand out awkwardly.
 */
export function RealEstateFlowchart() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % workflows.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const active = workflows[index];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center mt-20"
      >
        {active.steps.map((step, i) => (
          <React.Fragment key={step.label}>
            {/* ——— Node ——— */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
              className="relative z-10 w-[250px]"
            >
              {/* Top connector dot (skip for first node) */}
              {i !== 0 && (
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: step.path, border: "2px solid white" }}
                />
              )}

              <div
                className={`flex items-center gap-3 p-3 rounded-xl shadow-md border-4 border-white ${step.bg}`}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                  <step.icon className={`w-5 h-5 ${step.text}`} />
                </div>
                <h2 className={`text-lg font-bold ${step.text}`}>{step.label}</h2>
              </div>

              {/* Bottom connector dot (skip for last node) */}
              {i !== active.steps.length - 1 && (
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: step.path, border: "2px solid white" }}
                />
              )}
            </motion.div>

            {/* ——— Connector ——— */}
            {i !== active.steps.length - 1 && (
              <div className="w-[2px] h-[60px] mt-[1.5px] mb-[1.5px] overflow-hidden">
                <svg width="2" height="100%" preserveAspectRatio="none">
                  <motion.path
                    d="M1,0 L1,100"
                    stroke={step.path}
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    fill="none"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -100 }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }}
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
// Workflow definitions — colour palette & icons

const workflows = [
  {
    name: "Due-Diligence",
    steps: [
      s("Document Intake", FileText, "bg-blue-100", "text-blue-700", "#BFDBFE"),
      s("Auto-Parsing", Wand2, "bg-amber-100", "text-amber-700", "#FDE68A"),
      s("Insight Engine", Gauge, "bg-emerald-100", "text-emerald-700", "#A7F3D0"),
    ],
  },
  {
    name: "Acquisition",
    steps: [
      s("Property Search", Home, "bg-rose-100", "text-rose-700", "#FBCFE8"),
      s("Market Analysis", Brain, "bg-purple-100", "text-purple-700", "#D8B4FE"),
      s("Financial Model", FileSpreadsheet, "bg-green-100", "text-green-700", "#BBF7D0"),
      s("Decision", TrendingUp, "bg-orange-100", "text-orange-700", "#FED7AA"),
    ],
  },
  {
    name: "Lease-Admin",
    steps: [
      s("Lease Upload", FileText, "bg-sky-100", "text-sky-700", "#BAE6FD"),
      s("Clause Extraction", Wand2, "bg-indigo-100", "text-indigo-700", "#C7D2FE"),
      s("Critical Dates", ClipboardList, "bg-teal-100", "text-teal-700", "#99F6E4"),
      s("Automated Alerts", Settings2, "bg-amber-100", "text-amber-700", "#FDE68A"),
    ],
  },
  {
    name: "Asset-Mgmt",
    steps: [
      s("Data Aggregation", FileText, "bg-yellow-100", "text-yellow-800", "#FEF9C3"),
      s("KPI Tracking", Gauge, "bg-emerald-100", "text-emerald-700", "#A7F3D0"),
      s("Portfolio Insights", Brain, "bg-violet-100", "text-violet-700", "#E9D5FF"),
    ],
  },
  {
    name: "Entitlements",
    steps: [
      s("Zoning Docs", FileText, "bg-cyan-100", "text-cyan-700", "#CFFAFE"),
      s("Code Parsing", Wand2, "bg-rose-100", "text-rose-700", "#FBCFE8"),
      s("Compliance Checks", Gauge, "bg-green-100", "text-green-700", "#BBF7D0"),
      s("Submission Packet", FileSpreadsheet, "bg-blue-100", "text-blue-700", "#BFDBFE"),
    ],
  },
];

function s(label: string, icon: React.ElementType, bg: string, text: string, path: string) {
  return { label, icon, bg, text, path };
}

/* Tailwind safelist (bg-*/