# 🧠 DevelopIQ

**DevelopIQ is an AI-powered tool for real estate developers to instantly surface zoning and development constraints — starting with automated site investigation reports.**

We help developers, brokers, and land teams stop wasting hours on PDF scavenger hunts and city planner calls.

---

## ✅ Current Capabilities (MVP)

> What’s working *today* — and where it delivers value.

### 📍 1. Property Overview
Given an address or parcel ID, we fetch and aggregate:

- Parcel metadata (location, size, owner, use class)
- Market-level data (job trends, housing supply, demographics)

> 🔍 Data sourced from public APIs and government databases.

---

### 📘 2. Zoning Codebook Intelligence
This is our **LangGraph-powered agentic system**, focused on zoning feasibility.

- 🗂️ **Extractor Agent**  
  - Finds and retrieves the appropriate municipal codebook (HTML or PDF)
  - Chunks and indexes it for semantic search

- 🔍 **Querier Agent**  
  - Asks predefined development questions:
    - What are the permitted uses for this site?
    - What are the setbacks and height limits?
    - What is the rezoning process?
    - Are there historical overlays or design commissions?
  - Returns answers (with source citations) based on zoning code

> 🚨 This is *not* a chatbot. It’s a deterministic pipeline focused on **structured zoning answers**.
---

## 🔄 System Architecture

```
/frontend          ← Next.js (React, Tailwind) app for UI
/codebook_agent    ← LangGraph backend (agents + codebook parsing logic)
/util_python_lib   ← Utility scripts (data ingestion, API pipelines, needs cleanup)
```

- Hosted on LangGraph Platform
- Data currently flows one-way from static sources
- No user-upload support yet (coming)

---

## 🧪 Try It Locally

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend
Use Langsmith or LangGraph local dev mode.

```bash
langgraph dev
```

---

## 🎯 What We’re Not Yet Doing

We're being honest:

- ❌ No AI-generated proformas or valuations (yet)
- ❌ No user-uploaded documents (yet)
- ❌ No live code conflict detection (yet)

This is **MVP 0.1** — validating structured site investigation automation.

---

## 👀 What’s Next

- Integrate parcel lookup with zoning agent output
- Add surface-level red flag detection (e.g. “requires rezoning”, “2-year entitlement”)
- Merge historical overlays and flood/topo layers
- Create downloadable SIR (PDF or markdown)

---

## 👥 Contributors

- Kush Bhuwalka (`rhit-bhuwalk`)
- Logan McLaughlin
- Evan Brooks

---

## 📝 License

MIT License
