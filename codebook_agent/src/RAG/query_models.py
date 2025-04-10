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
    raw_context: str = Field(description="Raw context of the query")


# Unit-based models
class UnitsPerAcre(BaseModel):
    units: str = Field(description="Maximum density in units per acre")

class UnitsPerAcreWithSource(BaseModel):
    units: UnitsPerAcre = Field(description="Maximum density in units per acre")
    source: Source = Field(description="Source of the maximum density in units per acre")

class SquareFeet(BaseModel):
    square_feet: str = Field(description="Measurement in square feet")

class SquareFeetWithSource(BaseModel):
    square_feet: SquareFeet = Field(description="Measurement in square feet")
    source: Source = Field(description="Source of the measurement in square feet")

class Feet(BaseModel):
    feet: str = Field(description="Measurement in feet")

class FeetWithSource(BaseModel):
    feet: Feet = Field(description="Measurement in feet")
    source: Source = Field(description="Source of the measurement in feet")

class Percentage(BaseModel):
    percentage: str = Field(description="Measurement as a percentage")

class PercentageWithSource(BaseModel):
    percentage: Percentage = Field(description="Measurement as a percentage")
    source: Source = Field(description="Source of the measurement as a percentage")

class Summary(BaseModel):
    summary: str = Field(description="Detailed description or summary")

class SummaryWithSource(BaseModel):
    summary: Summary = Field(description="Detailed description or summary")
    source: Source = Field(description="Source of the detailed description or summary")

# Signage models
class SignList(BaseModel):
    signs: List[str] = Field(description="List of individual signs, with each sign as a separate item")

class SignListWithSource(BaseModel):
    signs: SignList = Field(description="List of individual signs, with each sign as a separate item")
    source: Source = Field(description="Source of the list of individual signs")

class DesignRequirements(BaseModel):
    requirements: str = Field(description="Detailed description of sign design requirements")

class DesignRequirementsWithSource(BaseModel):
    requirements: DesignRequirements = Field(description="Detailed description of sign design requirements")
    source: Source = Field(description="Source of the detailed description of sign design requirements")
    
class SignageRequirements(BaseModel):
    permitted_sign_types: Optional[SignListWithSource] = Field(None, alias="Permitted Sign Types")
    prohibited_sign_types: Optional[SignListWithSource] = Field(None, alias="Prohibited Sign Types")
    design_requirements: Optional[DesignRequirementsWithSource] = Field(None, alias="Design Requirements")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Parking models
class AisleWidth(BaseModel):
    feet: str = Field(description="The minimum aisle width required in the parking area, measured in feet")

class AisleWidthWithSource(BaseModel):
    feet: AisleWidth = Field(description="The minimum aisle width required in the parking area, measured in feet")
    source: Source = Field(description="Source of the minimum aisle width required in the parking area, measured in feet")

class SummaryRequirement(BaseModel):
    summary: str = Field(description="A detailed summary of the requirements")

class SummaryRequirementWithSource(BaseModel):
    summary: SummaryRequirement = Field(description="A detailed summary of the requirements")
    source: Source = Field(description="Source of the detailed summary of the requirements")

class ParkingRequirements(BaseModel):
    minimum_aisle_width: Optional[AisleWidthWithSource] = Field(None, alias="Minimum Aisle Width")
    curbing_requirements: Optional[SummaryRequirementWithSource] = Field(None, alias="Curbing Requirements")
    striping_requirements: Optional[SummaryRequirementWithSource] = Field(None, alias="Striping Requirements")
    drainage_requirements: Optional[SummaryRequirementWithSource] = Field(None, alias="Drainage Requirements")
    parking_stalls_required: Optional[SummaryRequirementWithSource] = Field(None, alias="Parking Stalls Required")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Lot Requirements model
class LotRequirements(BaseModel):
    maximum_density: Optional[UnitsPerAcreWithSource] = Field(None, alias="Maximum Density")
    minimum_lot_size: Optional[SquareFeetWithSource] = Field(None, alias="Minimum Lot Size")
    minimum_lot_width: Optional[FeetWithSource] = Field(None, alias="Minimum Lot Width")
    minimum_lot_frontage: Optional[FeetWithSource] = Field(None, alias="Minimum Lot Frontage")
    minimum_living_area: Optional[SquareFeetWithSource] = Field(None, alias="Minimum Living Area")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Building Placement model
class BuildingPlacementRequirements(BaseModel):
    minimum_front_setback: Optional[FeetWithSource] = Field(None, alias="Minimum Front Setback")
    minimum_street_side_setback: Optional[FeetWithSource] = Field(None, alias="Minimum Street Side Setback")
    minimum_side_yard_setback: Optional[FeetWithSource] = Field(None, alias="Minimum Side Yard Setback")
    minimum_rear_setback: Optional[FeetWithSource] = Field(None, alias="Minimum Rear Setback")
    accessory_building_setback: Optional[FeetWithSource] = Field(None, alias="Accessory Building Setback")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Building Requirements model
class BuildingRequirements(BaseModel):
    maximum_building_height: Optional[FeetWithSource] = Field(None, alias="Maximum Building Height")
    maximum_lot_coverage: Optional[PercentageWithSource] = Field(None, alias="Maximum Lot Coverage")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Landscaping Requirements model
class LandscapingRequirements(BaseModel):
    minimum_plant_sizes: Optional[FeetWithSource] = Field(None, alias="Minimum Plant Sizes")
    landscape_plan_review_summary: Optional[SummaryWithSource] = Field(None, alias="Landscape Plan Review Summary")
    species_variation_requirement_summary: Optional[SummaryWithSource] = Field(None, alias="Species Variation Requirement Summary")
    performance_guarantee_warranty_requirements_summary: Optional[SummaryWithSource] = Field(None, alias="Performance Guarantee Warranty Requirements Summary")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Permitted Uses models
class PermittedUsesList(BaseModel):
    uses: List[str] = Field(description="List of permitted uses")

class PermittedUsesListWithSource(BaseModel):
    permitted_uses: PermittedUsesList = Field(description="List of permitted uses")
    source: Source = Field(description="Source of the permitted uses")

class PermittedUses(BaseModel):
    permitted_uses: PermittedUsesListWithSource = Field(None, description="Permitted uses and source", alias="Permitted Uses")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Combined query result model
class QueryResult(BaseModel):
    signage_requirements: Optional[SignageRequirements] = None
    parking_requirements: Optional[ParkingRequirements] = None
    lot_requirements: Optional[LotRequirements] = None
    building_placement_requirements: Optional[BuildingPlacementRequirements] = None
    building_requirements: Optional[BuildingRequirements] = None
    landscaping_requirements: Optional[LandscapingRequirements] = None
    permitted_uses: Optional[PermittedUses] = None
    errors: Dict[str, str] = Field(default_factory=dict)