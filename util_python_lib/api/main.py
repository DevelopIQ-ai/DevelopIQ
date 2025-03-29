from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
import os, io
from dotenv import load_dotenv
from typing import Tuple, Callable
from inspect import currentframe, getframeinfo
import json
import os
import uuid
import uvicorn
from fastapi.middleware.cors import CORSMiddleware


# Import Zillow scraping functions
from zillow import scrape_zillow_property, extract_data
from PropertyZeroEntropy import PropertyZeroEntropy
app = FastAPI()
load_dotenv()  # Load environment variables from .env file

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any source
    allow_origin_regex=None,  # Disable regex as it's not needed when allowing all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ZillowRequest(BaseModel):
    url: str

class CodebookQuery(BaseModel):
    query: str
    userId: str
    query_type: str

@app.post("/get_mls_data")
async def get_mls_data(request: ZillowRequest):
    try:
        scraped_data = await scrape_zillow_property(request.url)
        print(request.url)
        print(scraped_data)
        if not scraped_data or not scraped_data["json_data_found"]:
            raise HTTPException(status_code=404, detail="Failed to scrape data from Zillow URL")

        temp_scraped_file = f"temp_scraped_{uuid.uuid4()}.json"

        try:
            with open(temp_scraped_file, "w", encoding='utf-8') as json_file:
                json.dump(scraped_data["data_json"], json_file, indent=2, ensure_ascii=False)

            # Synchronously extract
            properties_data = extract_data(temp_scraped_file)
            print('extraction complete!')
            return properties_data

        finally:
            # Clean up temp file
            if os.path.exists(temp_scraped_file):
                os.remove(temp_scraped_file)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Zillow data: {str(e)}")

@app.post("/query_codebook")
async def query_codebook(request: CodebookQuery):
    id = request.userId
    query = request.query
    z = PropertyZeroEntropy(api_key=os.getenv("ZERO_ENTROPY_API_KEY"), collection_name=id)
    if request.query_type == "zoning":
        query = f"Which section is related to the requirements in zoning code {request.query}?"
    answer = z.get_snippets_info(query)
    return answer
  

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)