"""Pydantic models for municipal code query results."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# Source-based models
class Chunk(BaseModel):
    id: str = Field(description="Unique identifier for the chunk")
    sectionNumber: str = Field(description="Section number of the chunk")
    sectionName: str = Field(description="Section name of the chunk")
    chapterNumber: str = Field(description="Chapter number of the chunk")
    text: str = Field(description="Text of the chunk")

class Source(BaseModel):
    chunks: List[Chunk] = Field(description="List of chunks")
    section_list: List[str] = Field(description="List of section numbers")

class NumericalAnswer(BaseModel):
    answer: str = Field(description="Answer to the question. This should be a number followed by the unit of measurement.")

