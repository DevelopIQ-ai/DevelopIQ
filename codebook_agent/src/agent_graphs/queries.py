"""Query prompts for municipal code analysis."""

# Signage Requirements Queries
SIGNAGE_QUERIES = {
    "permitted_signs": "What sign types are permitted in {zone_code} zone? List all permitted signs.",
    "prohibited_signs": "What sign types are prohibited in {zone_code}. List all prohibited signs.",
    "design_requirements": "What are the design requirements for signs in {zone_code}. Include material, illumination, and size requirements."
}

# Parking Requirements Queries
PARKING_QUERIES = {
    "aisle_width": "What is the minimum aisle width requirement for parking in {zone_code} zone? Provide the measurement in feet.",
    "curbing_requirements": "What are the curbing requirements for parking areas in {zone_code} zone?",
    "striping_requirements": "What are the striping requirements for parking areas in {zone_code} zone?",
    "drainage_requirements": "What are the drainage requirements for parking areas in {zone_code} zone?",
    "parking_stalls": "How many parking stalls are required for different uses in {zone_code} zone?"
}

# Lot Requirements Queries
LOT_REQUIREMENTS_QUERIES = {
    "density": "What is the maximum density allowed in {zone_code} zone? Provide the number of units per acre.",
    "lot_size": "What is the minimum lot size required in {zone_code} zone? Provide the measurement in square feet.",
    "lot_width": "What is the minimum lot width required in {zone_code} zone? Provide the measurement in feet.",
    "lot_frontage": "What is the minimum lot frontage required in {zone_code} zone? Provide the measurement in feet.",
    "living_area": "What is the minimum living area required in {zone_code} zone? Provide the measurement in square feet."
}

# Building Placement Requirements Queries
BUILDING_PLACEMENT_QUERIES = {
    "front_setback": "What is the minimum front setback requirement in {zone_code} zone? Provide the measurement in feet.",
    "street_side_setback": "What is the minimum street side setback requirement in {zone_code} zone? Provide the measurement in feet.",
    "side_yard_setback": "What is the minimum side yard setback requirement in {zone_code} zone? Provide the measurement in feet.",
    "rear_setback": "What is the minimum rear setback requirement in {zone_code} zone? Provide the measurement in feet.",
    "accessory_building_setback": "What is the minimum accessory building setback requirement in {zone_code} zone? Provide the measurement in feet."
}

# Building Requirements Queries
BUILDING_REQUIREMENTS_QUERIES = {
    "maximum_building_height": 
    """
    What is the maximum building height allowed in {zone_code} zone? Provide the measurement in feet.
    If you cannot find the information, respond with 'N/A'. Be concise and to the point.
    If for the {zone_code} zone, there is only one answer, respond with that answer.
    If there are multiple answers with different caveats or use cases for maximum building height, list all of them.
    Think before you answer.
    Here are some examples of answers you might give:
    <EXAMPLE OUTPUTS>
    <EXAMPLE>
     10 feet
    </EXAMPLE>
    <EXAMPLE>
    Single-Family Dwelling: 35% Corner Lot, 30% interior lot
    Two-Family Dwelling: 40% Corner Lot, 35% interior lot
    Group House and Garden Apartments: 50% Corner Lot, 40% interior lot
    Apartment House: 60% Corner Lot, 50% interior lot
    </EXAMPLE>
    </EXAMPLE OUTPUTS>
    """,
    "maximum_lot_coverage": "What is the maximum lot coverage allowed in {zone_code} zone? Provide the percentage."
}

# Landscaping Requirements Queries
LANDSCAPING_QUERIES = {
    "plant_sizes": "What are the minimum plant sizes required for landscaping in {zone_code} zone? Provide the measurements in feet.",
    "landscape_plan_review": "What is the landscape plan review process for {zone_code} zone? Provide a summary.",
    "species_variation": "What are the species variation requirements for landscaping in {zone_code} zone? Provide a summary.",
    "performance_guarantee": "What are the performance guarantee and warranty requirements for landscaping in {zone_code} zone? Provide a summary."
}

#Permitted Uses Queries
PERMITTED_USES_QUERIES = {
    "permitted_uses": """
    <INSTRUCTIONS>
    - Only list uses that are permitted in the {zone_code} zone, as denoted by the cell value having 'P' or 'S' in that column. Permitted uses ONLY include 'P' or 'S'.
    - Ignore cells with any other values
    </INSTRUCTIONS>

    <QUESTION>
    What are the permitted uses for {zone_code} zone? List the use along with the cell value in the response.
    </QUESTION>

    <EXAMPLE>
    Bed and Breakfast Establishments (P)
    Recreational Facilities (S)
    </EXAMPLE>
    """
}

# Enhanced query templates with more specific instructions for better extraction
ENHANCED_QUERY_TEMPLATES = {
    "numeric_with_unit": "What is the {measurement_name} in {zone_code} zone? Please respond with ONLY the numeric value and unit (e.g., '10 feet'). If multiple values exist for different contexts, list each one with its specific context.",
    "list_items": "List all {item_type} in {zone_code} zone. Format your response as a bulleted list with each item on a new line preceded by a dash (-).",   
    "summary_with_key_points": "Summarize the {requirement_type} for {zone_code} zone. Include only the key points and requirements. Be specific and concise."
}

# Helper function to format a query with parameters
def format_query(query_template, **kwargs):
    """Format a query template with the provided parameters."""
    return query_template.format(**kwargs)