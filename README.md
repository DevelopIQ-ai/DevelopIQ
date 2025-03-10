# DevelopIQ

PropertyAI is an intelligent real estate data aggregation and analysis system designed to automate property research. The system processes property links, extracts relevant details from multiple sources, and compiles comprehensive datasets for real estate analysis.

## 🏗️ Project Structure

The project is organized into two main components:

- **Frontend**: A Next.js application with React, TypeScript, and Tailwind CSS
- **Server**: A FastAPI backend with Python that handles data extraction and processing

## ✨ Features

- Process property links to extract key identifiers and context
- Retrieve information from multiple sources including listing platforms, government records, and market analysis platforms
- Normalize and aggregate data into structured formats
- Generate detailed property reports with insights and analysis
- Handle high volumes of property links simultaneously

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn for the frontend
- Python 3.11+ and Poetry for the server
- Docker (optional, for containerized deployment)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local  # Configure your environment variables
npm run dev
```

The frontend will be available at http://localhost:3000

### Server Setup

```bash
cd server
poetry install
poetry run uvicorn api.main:app --reload
```

The API will be available at http://localhost:8000

## 🛠️ Technologies

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI**: React 18, Shadcn UI, Radix UI components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Data Validation**: Zod

### Backend
- **Framework**: FastAPI
- **Data Processing**: Pandas, BeautifulSoup4
- **Async Operations**: asyncio, aiohttp
- **Web Automation**: Playwright
- **Agent System**: AgentQL, BrowserBase
- **Data Models**: Pydantic

## 🔄 Workflow

1. **Input**: The system accepts a property link as input
2. **Processing**: Specialized agents extract data from multiple sources
3. **Compilation**: Data is normalized and aggregated
4. **Output**: A detailed report is generated with property information and insights

## 🧩 Key Components

- **Data Extraction Agents**: Specialized modules for retrieving information from different sources
- **Data Normalization**: Standardizes data formats for consistency
- **Cross-checking System**: Resolves discrepancies between data sources
- **Report Generation**: Creates comprehensive property reports

## 📝 License

MIT License

## 👥 Contributors

- Kush Bhuwalka (rhit-bhuwalk)
- Logan McLaughlin (loganmclaughlin)
- Evan Brooks (evanbrooks)
