"""Pydantic models for municipal code query results."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

# Unit-based models
class UnitsPerAcre(BaseModel):
    units: str = Field(description="Maximum density in units per acre")

class SquareFeet(BaseModel):
    square_feet: str = Field(description="Measurement in square feet")

class Feet(BaseModel):
    feet: str = Field(description="Measurement in feet")

class Percentage(BaseModel):
    percentage: str = Field(description="Measurement as a percentage")

class Summary(BaseModel):
    summary: str = Field(description="Detailed description or summary")

# Signage models
class SignList(BaseModel):
    signs: List[str] = Field(description="List of individual signs, with each sign as a separate item")

class DesignRequirements(BaseModel):
    requirements: str = Field(description="Detailed description of sign design requirements")
    
class SignageRequirements(BaseModel):
    permitted_sign_types: Optional[SignList] = Field(None, alias="Permitted Sign Types")
    prohibited_sign_types: Optional[SignList] = Field(None, alias="Prohibited Sign Types")
    design_requirements: Optional[DesignRequirements] = Field(None, alias="Design Requirements")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Parking models
class AisleWidth(BaseModel):
    feet: str = Field(description="The minimum aisle width required in the parking area, measured in feet")

class SummaryRequirement(BaseModel):
    summary: str = Field(description="A detailed summary of the requirements")

class ParkingRequirements(BaseModel):
    minimum_aisle_width: Optional[AisleWidth] = Field(None, alias="Minimum Aisle Width")
    curbing_requirements: Optional[SummaryRequirement] = Field(None, alias="Curbing Requirements")
    striping_requirements: Optional[SummaryRequirement] = Field(None, alias="Striping Requirements")
    drainage_requirements: Optional[SummaryRequirement] = Field(None, alias="Drainage Requirements")
    parking_stalls_required: Optional[SummaryRequirement] = Field(None, alias="Parking Stalls Required")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Lot Requirements model
class LotRequirements(BaseModel):
    maximum_density: Optional[UnitsPerAcre] = Field(None, alias="Maximum Density")
    minimum_lot_size: Optional[SquareFeet] = Field(None, alias="Minimum Lot Size")
    minimum_lot_width: Optional[Feet] = Field(None, alias="Minimum Lot Width")
    minimum_lot_frontage: Optional[Feet] = Field(None, alias="Minimum Lot Frontage")
    minimum_living_area: Optional[SquareFeet] = Field(None, alias="Minimum Living Area")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Building Placement model
class BuildingPlacementRequirements(BaseModel):
    minimum_front_setback: Optional[Feet] = Field(None, alias="Minimum Front Setback")
    minimum_street_side_setback: Optional[Feet] = Field(None, alias="Minimum Street Side Setback")
    minimum_side_yard_setback: Optional[Feet] = Field(None, alias="Minimum Side Yard Setback")
    minimum_rear_setback: Optional[Feet] = Field(None, alias="Minimum Rear Setback")
    accessory_building_setback: Optional[Feet] = Field(None, alias="Accessory Building Setback")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Building Requirements model
class BuildingRequirements(BaseModel):
    maximum_building_height: Optional[Feet] = Field(None, alias="Maximum Building Height")
    maximum_lot_coverage: Optional[Percentage] = Field(None, alias="Maximum Lot Coverage")
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

# Landscaping Requirements model
class LandscapingRequirements(BaseModel):
    minimum_plant_sizes: Optional[Feet] = Field(None, alias="Minimum Plant Sizes")
    landscape_plan_review_summary: Optional[Summary] = Field(None, alias="Landscape Plan Review Summary")
    species_variation_requirement_summary: Optional[Summary] = Field(None, alias="Species Variation Requirement Summary")
    performance_guarantee_warranty_requirements_summary: Optional[Summary] = Field(None, alias="Performance Guarantee Warranty Requirements Summary")
    
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
    errors: Dict[str, str] = Field(default_factory=dict)