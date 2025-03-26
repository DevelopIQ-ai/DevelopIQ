# hints = {
#     "permitted_use": {
      
#         "permitted_uses": [
#                 {
#                 "primary_use_classification": "Residential Primary Uses",
#                 "permitted_uses": [
#                     "Dwelling - Bungalow Court",
#                     "Dwelling - Townhouse",
#                     "Dwelling - Apartment Building: Small",
#                     "Dwelling - Apartment Building: Large",
#                     "Live/Work Dwelling",
#                     "Upper Story Residential"
#                 ],
#                 "special_exceptions": [
#                     "Dwelling - Single-Family Detached: Standard",
#                     "Dwelling - Single-Family Detached: Compact",
#                     "Dwelling - Duplex",
#                     "Accessory Dwelling Unit",
#                     "Assissted Living Facilities",
#                     "Childcare Home",
#                     "Group Residential Facility",
#                     "Rooming or Boarding House"
#                 ]
#                 },
#                 {
#                 "primary_use_classification": "Civic, Public, and Institutional Primary Uses",
#                 "permitted_uses": [
#                     "Libraries, Museums, and Cultural Facilities",
#                     "Municipal and Government Buildings",
#                     "Parks and Playgrounds",
#                     "Commercial Studios",
#                     "Club or Lodge"
#                 ],
#                 "special_exceptions": [
#                     "Utility, Minor Impact",
#                     "Childcare Facility",
#                     "Community Center",
#                     "Hospital, Minor",
#                     "Colleges and Universities",
#                     "Vocational Schools",
#                     "Banquet Facilities and Reception Halls",
#                     "Places of Worship",
#                     "Public and Religous Asswmbly, All Others"
#                 ]
#                 },
#                 {
#                 "primary_use_classification": "Commercial Sales, Services, and Repair Primary Uses",
#                 "permitted_uses": [
#                     "Arts, Recreation, Entertainment, Indoor",
#                     "Restaurants - Class A (table service)",
#                     "Restaurants - Class B (counter service, no drive-thru)",
#                     "Taverns",
#                     "Winery and Microbrewery",
#                     "Dental/Medical Offuce or Clinic",
#                     "Banks and Financial Institutions"
#                 ],
#                 "special_exceptions": [
#                     "Arts, Recreation, Entertainment, Outdoor",
#                     "Sports and/or Entertainment Arena or Stadium",
#                     "Parking Garage",
#                     "Parking Lot",
#                     "Restaurants - Class C (counter service w/drive-thru)",
#                     "Bed and Breakfast Establishments",
#                     "Hotel or Motel",
#                     "Animal Sales and Services, Household Pets Only",
#                     "Food Catering Service"
#                 ]
#                 },
#                 {
#                 "primary_use_classification": "Industrial, Manufacturing, and Wholesale Primary Uses",
#                 "permitted_uses": [
#                     "Grain and Feed Mills"
#                 ],
#                 "special_exceptions": [
#                     "Mass Transit Facility",
#                     "Recycling Drop-Off Facility"
#                 ]
#                 },
#                 {
#                 "primary_use_classification": "Agriculture Primary Uses",
#                 "permitted_uses": [],
#                 "special_exceptions": []
#                 }
#             ]
#             }
#         </OUTPUT>
        
#          """,

#         "expected_output": """
#             Return your findings for zone code: {zone_code}. Return JSON in the following format:
#             {
#             "permitted_uses": [
#                 {
#                 "primary_use_classification": the category of use,
#                 "permitted_uses": a list of permitted uses for the primary use classification that are relevant to zone code {zone_code},
#                 "special_exceptions": a list of special exceptions for the primary use classification that are relevant to zone code {zone_code}
#                 }
#             ]
#             }
#         """
#     },
#     "development_standards": {
        
#         "expected_output": """
#         Return your findings for zone code: {zone_code}. Return JSON in the following format:
#             "{
#             "lot_requirements": {
#                 "maximum_density": {
#                     "units_per_acre": "The maximum number of housing units allowed per acre."
#                 },
#                 "minimum_lot_size": {
#                     "square_feet": "The smallest permissible lot area, measured in square feet."
#                 },
#                 "minimum_lot_width": {
#                     "feet": "The minimum width of the lot, measured in feet."
#                 },
#                 "minimum_lot_frontage": {
#                     "feet": "The minimum frontage (front yard) of the lot, measured in feet."
#                 },
#                 "minimum_living_area": {
#                     "square_feet": "The minimum required living area inside the building, measured in square feet."
#                 }
#             },
#             "building_placement_requirements": {
#                 "minimum_front_setback": {
#                     "feet": "The minimum distance the building must be set back from the front property line, measured in feet."
#                 },
#                 "minimum_street_side_setback": {
#                     "feet": "The minimum setback required from the street side of the property, measured in feet."
#                 },
#                 "minimum_side_yard_setback": {    
#                     "feet": "The minimum distance required from the property’s side boundaries, measured in feet."
#                 },
#                 "minimum_rear_setback": {
#                     "feet": "The minimum setback required from the rear property line, measured in feet."
#                 },
#                 "accessory_building_setback": {
#                     "feet": "The minimum setback required for accessory buildings from the primary structure or property lines, measured in feet."
#                 }
#             },
#             "building_requirements": {  
#                 "maximum_building_height": {
#                     "feet": "The tallest permissible building height, measured in feet."
#                 },
#                 "maximum_lot_coverage": {
#                     "percentage": "The maximum percentage of the lot that can be covered by the building footprint."
#                 }
#             },
#         ""landscaping_requirements"": {
#             ""minimum_plant_sizes"": {
#             ""feet"": ""A table or guideline specifying the minimum plant sizes allowed or recommended, measured in feet.""
#             },
#             ""landscape_plan_review_summary"": {
#             ""summary"": ""A summary outlining the requirements or review criteria for the landscaping plan.""
#             },
#             ""species_variation_requirement_summary"": {
#             ""summary"": ""A description of the requirements for species diversity in the landscaping plan.""
#             },
#             ""performance_guarantee_warranty_requirements_summary"": {
#             ""summary"": ""A summary of any performance guarantee or warranty requirements related to landscaping.""
#             }
#         },
#         ""parking_requirements"": {
#             ""minimum_aisle_width"": {
#             ""feet"": ""The minimum aisle width required in the parking area, measured in feet.""
#             },
#             ""curbing_requirements"": {
#             ""summary"": ""A description of the curbing standards and specifications for the parking lot.""
#             },
#             ""striping_requirements"": {
#             ""summary"": ""A summary of the requirements for parking lot striping, including layout and dimensions.""
#             },
#             ""drainage_requirements"": {
#             ""summary"": ""A summary of the drainage standards that must be met within the parking area.""
#             },
#             ""parking_stalls_required"": {
#             ""summary"": ""A description of the number or configuration of parking stalls required, including any specifics such as ADA stalls.""
#             }
#         },
#         ""signage_requirements"": {
#             ""permitted_sign_types"": {
#             ""summary"": ""A summary of the types of signs that are allowed under the zoning or planning guidelines.""
#             },
#             ""prohibited_sign_types"": {
#             ""summary"": ""A summary of the types of signs that are not allowed under the zoning or planning guidelines.""
#             },
#             ""design_requirements"": {
#             ""summary"": ""A description of the design requirements for signage, including specifications on size, color, and shape.""
#             }
#         }
# }"
#         """
#     },
       