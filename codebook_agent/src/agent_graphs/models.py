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

class Feet(BaseModel):
    feet: str = Field(description="Measurement in feet")

class FeetWithSource(BaseModel):
    feet: Feet = Field(description="Measurement in feet")
    source: Source = Field(description="Source of the measurement in feet")
  

class Percentage(BaseModel):
    percentage: str = Field(description="Measurement in percentage")

class PercentageWithSource(BaseModel):
    percentage: Percentage = Field(description="Measurement in percentage")
    source: Source = Field(description="Source of the measurement in percentage")
  
class BuildingRequirements(BaseModel):
    maximum_building_height: Optional[FeetWithSource] = Field(None, alias="Maximum Building Height")
    maximum_lot_coverage: Optional[PercentageWithSource] = Field(None, alias="Maximum Lot Coverage")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class QueryResult(BaseModel):
    building_requirements: Optional[BuildingRequirements] = None
    errors: Dict[str, str] = Field(default_factory=dict)