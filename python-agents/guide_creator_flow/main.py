from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import asyncio
from concurrent.futures import ThreadPoolExecutor
from src.codebook_flow.main import kickoff

# Initialize FastAPI app
app = FastAPI(
    title="Codebook Flow API",
    description="API for running codebook flow",
    version="0.1.0"
)

# Create a thread pool executor for running blocking functions
executor = ThreadPoolExecutor()

# Define request body model
class CodebookParams(BaseModel):
    state_code: str = "IN"
    municipality: str = "Bargersville"
    zone_code: str = "R-R"

# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Codebook Flow API"}

# Run endpoint that calls kickoff function in a separate thread
@app.post("/run")
async def run_codebook(params: CodebookParams):
    # Run the kickoff function in a separate thread to avoid event loop conflicts
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        executor, 
        lambda: kickoff(state_code=params.state_code, municipality=params.municipality, zone_code=params.zone_code)
    )
    return {"status": "success", "result": result}

# Start the server with: uvicorn main:app --reload
