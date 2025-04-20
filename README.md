![image](https://github.com/user-attachments/assets/5b45d8fc-b502-4adb-a289-6815c6a281ae)





# DevelopIQ

DevelopIQ is a real estate data aggregation and analysis system designed to automate property research. The system processes parcel addresses, extracts relevant details from multiple sources, and compiles comprehensive datasets for real estate analysis. 

## 🏗️ Project Structure

The project is organized into two main components:

- **/frontend**: A Next.js application with React, TypeScript, and Tailwind CSS
- **/codebook_agent**: A langgraph backend for agentic behaviours, hosted on the langgraph platform.
- **/util_python_lib**: A collection of various python scripts that we found useful. Disorganized.


## ✨ Features

- Process property links to extract key identifiers and context
- Retrieve information from multiple sources including attom, zoneomics, esri, BLS, census.gov, etc.
- Finds jurisdiction codes and extracts crucial development information
- Extensive AI powered market research

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn for the frontend
- Python >=3.9,<4.0 for langgraph 

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local  # Configure your environment variables
npm run dev
```
You will need a few environment variables.

The frontend will be available at http://localhost:3000

### Server Setup

Use Langsmith. After setting up a project, input the langgraph environment variables from your project. Specifically LANGGRAPH_URL = {url} and LANGGRAPH_TRACEABLE_V2 = True. Then, you may run

```bash
langgraph dev
```

The API will be available at the Langgraph URL, which is at {url}

## 🔄 Langgraph Workflow

There are two agents that are currently designed.

### EXTRACTOR AGENT
1. Checks if the codebook exists
2. If not, finds the codebook
3. Chunks the codebook

Querier Agent
1. Queries the codebook for all relevant pre-defined questions
2. Returns answers.

## 📝 License

MIT License

## 👥 Contributors

- Kush Bhuwalka (rhit-bhuwalk)
- Logan McLaughlin (loganmclaughlin)
- Evan Brooks (evanbrooks)
