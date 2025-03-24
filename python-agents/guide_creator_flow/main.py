from fastapi import FastAPI
from src.codebook_flow.main import kickoff
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/kickoff")
def kickoff_endpoint():
    result = kickoff()
    return {"result": result}
