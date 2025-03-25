hints = {
    "permitted_use": {
        "title_finding_hint": """
            Look for the appropriate titles in the table of contents that include development standards. Development standards are often labeled under different titles depending on the municipality such as:
                • “Land Use"
                • “Zoning Code"
                • “Land Use Code"
                • “Unified Development Ordinance (UDO)"
                • “Unified Development Code (UDC)"
                • “Comprehensive Zoning Ordinance"
                • “Development Code"
                • “Planning and Zoning Code"
                • “Subdivision and Zoning Ordinance"
                • “Land Development Code"
                • “Municipal Zoning Ordinance"
                • “Zoning and Subdivision Regulations"
                • “Land Use Ordinance"
                • “Building and Zoning Code"
                • “Urban Development Code"
        """,
        
        "section_finding_hint": """
                • PERMITTED USES: Activities allowed by right without additional review for residential, commercial, or industrial zoning classifications. Include special exceptions. Can also look for: “allowed by right,” “permitted activity,” or “use classification.”                
             """,
                    
        "analysis_goal": """
         Extract and analyze the permitted use tables to identify all permitted uses and special exceptions for the given zone code.
        """,


        "verification_hint": """

        Verify that the section has the following information. 
        It should have one or many categories, such as Residential Primary Uses or Civic, Public and Institutional Primary Uses. 
        These are called Primary Use Classifications. Under each of these, you will have a list of permitted uses and special exceptions.
   
        This information is typically listed out or shown in a tabular format with characters such as "P" representing permitted use or "S" representing Special Exception. 
        Typically when listed out, the permitted uses are listed out under each zoning classification.        
        We will want to return the list of permitted uses corresponding to those for {zone_code}. 
        """,

        "analysis_process": """
        The permitted uses are typically shown in a table. When analyzing table data, use the following algorithm. 
            a) Identify all table structures in the section content, which is denoted by --BEGIN-TABLE-- and --END-TABLE-- delimiters
            b) For each table, determine if it contains zoning information by looking for:
                - Headers containing zoning district designations
                - Columns with values like "P", "S", "Y", "N", or similar indicators
            c) Locate the target zone code column by finding exact or normalized matches (e.g., both "XX" and "X-X" could be valid)
            d) Identify classification headers by looking for:
                - Rows that span multiple columns
                - Rows in all capital letters
                - Rows containing terms like "USES", "RESIDENTIAL", "COMMERCIAL", etc.
            e) Extract use names and their corresponding permissions by:
                - Finding rows where the first cell contains a specific use name
                - Checking the value in the target zone code column
                - Categorizing based on the permission indicator (e.g., "P", "S", "Y", etc.)

        Note: When parsing table data, note that each table has two components:
            - "raw_data": contains the actual text content of each cell
            - "row_metadata": contains structural information about each row

            Use the "row_metadata" to identify:
            - Rows with spans/colspan (look for "spans" array in the metadata)
            - All-caps text (check the "is_all_caps" field)
            - The number of empty cells (see "empty_cells" count)
        Also, combine tables that contain "(CONT'D)" or other variations of "continued" in their classification to ensure uses from the same classification are grouped together. 
        """,

        "examples": """
            See the example below for a codebook with zone_code set to 'DT':

        <INPUT>
        {'root': {'Permitted Uses': [{'sub_topic': 'Permitted Uses', 'section_number': ['154.039', '154.040'], 'section_title': ['PERMITTED USES', 'PERMITTED USE TABLE'], 'relevance_score': [10, 10], 'reason': ['Defines the uses allowed by right in the RR zoning classification.', 'Provides a table outlining various permitted activities and use classifications.']}]}}
        </INPUT>
        Note: this input is coming from the find_sections task.
                
        <OUTPUT>
        {
        "permitted_uses": [
                {
                "primary_use_classification": "Residential Primary Uses",
                "permitted_uses": [
                    "Dwelling - Bungalow Court",
                    "Dwelling - Townhouse",
                    "Dwelling - Apartment Building: Small",
                    "Dwelling - Apartment Building: Large",
                    "Live/Work Dwelling",
                    "Upper Story Residential"
                ],
                "special_exceptions": [
                    "Dwelling - Single-Family Detached: Standard",
                    "Dwelling - Single-Family Detached: Compact",
                    "Dwelling - Duplex",
                    "Accessory Dwelling Unit",
                    "Assissted Living Facilities",
                    "Childcare Home",
                    "Group Residential Facility",
                    "Rooming or Boarding House"
                ]
                },
                {
                "primary_use_classification": "Civic, Public, and Institutional Primary Uses",
                "permitted_uses": [
                    "Libraries, Museums, and Cultural Facilities",
                    "Municipal and Government Buildings",
                    "Parks and Playgrounds",
                    "Commercial Studios",
                    "Club or Lodge"
                ],
                "special_exceptions": [
                    "Utility, Minor Impact",
                    "Childcare Facility",
                    "Community Center",
                    "Hospital, Minor",
                    "Colleges and Universities",
                    "Vocational Schools",
                    "Banquet Facilities and Reception Halls",
                    "Places of Worship",
                    "Public and Religous Asswmbly, All Others"
                ]
                },
                {
                "primary_use_classification": "Commercial Sales, Services, and Repair Primary Uses",
                "permitted_uses": [
                    "Arts, Recreation, Entertainment, Indoor",
                    "Restaurants - Class A (table service)",
                    "Restaurants - Class B (counter service, no drive-thru)",
                    "Taverns",
                    "Winery and Microbrewery",
                    "Dental/Medical Offuce or Clinic",
                    "Banks and Financial Institutions"
                ],
                "special_exceptions": [
                    "Arts, Recreation, Entertainment, Outdoor",
                    "Sports and/or Entertainment Arena or Stadium",
                    "Parking Garage",
                    "Parking Lot",
                    "Restaurants - Class C (counter service w/drive-thru)",
                    "Bed and Breakfast Establishments",
                    "Hotel or Motel",
                    "Animal Sales and Services, Household Pets Only",
                    "Food Catering Service"
                ]
                },
                {
                "primary_use_classification": "Industrial, Manufacturing, and Wholesale Primary Uses",
                "permitted_uses": [
                    "Grain and Feed Mills"
                ],
                "special_exceptions": [
                    "Mass Transit Facility",
                    "Recycling Drop-Off Facility"
                ]
                },
                {
                "primary_use_classification": "Agriculture Primary Uses",
                "permitted_uses": [],
                "special_exceptions": []
                }
            ]
            }
        </OUTPUT>
        
         """,

        "expected_output": """
            Return your findings for zone code: {zone_code}. Return JSON in the following format:
            {
            "permitted_uses": [
                {
                "primary_use_classification": the category of use,
                "permitted_uses": a list of permitted uses for the primary use classification that are relevant to zone code {zone_code},
                "special_exceptions": a list of special exceptions for the primary use classification that are relevant to zone code {zone_code}
                }
            ]
            }
        """
    },
    "development_standards": {
        "title_finding_hint": """
            Look for the appropriate titles in the table of contents that include development standards. Development standards are often labeled under different titles depending on the municipality such as:
                • “Land Use"
                • “Zoning Code"
                • “Land Use Code"
                • “Unified Development Ordinance (UDO)"
                • “Unified Development Code (UDC)"
                • “Comprehensive Zoning Ordinance"
                • “Development Code"
                • “Planning and Zoning Code"
                • “Subdivision and Zoning Ordinance"
                • “Land Development Code"
                • “Municipal Zoning Ordinance"
                • “Zoning and Subdivision Regulations"
                • “Land Use Ordinance"
                • “Building and Zoning Code"
                • “Urban Development Code"
        """,
       "chapter_finding_hint": """
        Look for chapters that include development standards. Development standards are often labeled under different titles depending on the municipality such as:
                • “Land Use"
                • “Zoning Code"
                • “Land Use Code"
                • “Unified Development Ordinance (UDO)"
        """,
        "section_finding_hint": """
            1. LOT REQUIREMENTS: This section may include information such as: Maximum Density, Minimum Lot Size, Minimum Frontage, Minimum Living Area, and more.
            2. BUILDING PLACEMENT REQUIREMENTS: This section may include information such as: Minimum Front Setback, Minimum Street Side Setback, Minimum Rear Setback, Accessory Building Setback, and more.
            3. BUILDING REQUIREMENTS: This section may include information such as: Maximum Building Height, Maximum Lot Coverage, and more.
            4. LANDSCAPING REQUIREMENTS: This section may include information such as: A table of minumum/maximum plant sizes, landscape plan review summary, species variation requirements, performance guarantee/warranty information, tree information, and more.
            5. PARKING REQUIREMENTS: This section may include information such as: Aisle width requirements, curbing requirements, parking stall minimums or maximums (number of parking stalls required), ADA parking requirements, parking lot striping and lighting requirements, parking stall size requirements, and more. 
            6. LIGHTING REQUIREMENTS: This section may include information such as: Lighting fixture design requirements, lumonesence requirements, and light density requirements, and more.
            7. SIGNAGE REQUIREMENTS: This section may include information such as: Prohibited sign types, permitted sign types, and a summary of design requirements including size and color and shape. 
        """,

        "all_sections_hint": """
        Look for sections that have may use cases for the given zone code.
        """,

        "analysis_goal": """
         Find and return the relevant information in development standards for the given zone code.
        """,

        "analysis_process": """
          
        """,

        "verification_hint": """
           •  For setbacks key words will appear such as: “front yard,” “side yard,” “rear yard,” or “minimum distance.” 
            • For building height: “maximum height,” “vertical envelope,” or “height limits.”
            • For parking: “parking stall dimensions,” “ADA compliance,” or “off-street parking.”
            • For landscaping: “tree canopy,” “planting requirements,” or “screening standards.”
            • For signs: "master sign plan", "comprehensive sign plan", "placement", "quantity", "size", "design".

         """,

        "thought_process": """
            The thought process here is simple. Look at the expected output and see what information we need to extract. Keep filling it up. Whatever you cannot find, return empty. You should be able to find most things if not all.
            Expected output: {expected_output}
        """,
        
        "examples": """
           
        """,
        
        "expected_output": """
        Return your findings for zone code: {zone_code}. Return JSON in the following format:
            "{
            "lot_requirements": {
                "maximum_density": {
                    "units_per_acre": "The maximum number of housing units allowed per acre."
                },
                "minimum_lot_size": {
                    "square_feet": "The smallest permissible lot area, measured in square feet."
                },
                "minimum_lot_width": {
                    "feet": "The minimum width of the lot, measured in feet."
                },
                "minimum_lot_frontage": {
                    "feet": "The minimum frontage (front yard) of the lot, measured in feet."
                },
                "minimum_living_area": {
                    "square_feet": "The minimum required living area inside the building, measured in square feet."
                }
            },
            "building_placement_requirements": {
                "minimum_front_setback": {
                    "feet": "The minimum distance the building must be set back from the front property line, measured in feet."
                },
                "minimum_street_side_setback": {
                    "feet": "The minimum setback required from the street side of the property, measured in feet."
                },
                "minimum_side_yard_setback": {    
                    "feet": "The minimum distance required from the property’s side boundaries, measured in feet."
                },
                "minimum_rear_setback": {
                    "feet": "The minimum setback required from the rear property line, measured in feet."
                },
                "accessory_building_setback": {
                    "feet": "The minimum setback required for accessory buildings from the primary structure or property lines, measured in feet."
                }
            },
            "building_requirements": {  
                "maximum_building_height": {
                    "feet": "The tallest permissible building height, measured in feet."
                },
                "maximum_lot_coverage": {
                    "percentage": "The maximum percentage of the lot that can be covered by the building footprint."
                }
            },
        ""landscaping_requirements"": {
            ""minimum_plant_sizes"": {
            ""feet"": ""A table or guideline specifying the minimum plant sizes allowed or recommended, measured in feet.""
            },
            ""landscape_plan_review_summary"": {
            ""summary"": ""A summary outlining the requirements or review criteria for the landscaping plan.""
            },
            ""species_variation_requirement_summary"": {
            ""summary"": ""A description of the requirements for species diversity in the landscaping plan.""
            },
            ""performance_guarantee_warranty_requirements_summary"": {
            ""summary"": ""A summary of any performance guarantee or warranty requirements related to landscaping.""
            }
        },
        ""parking_requirements"": {
            ""minimum_aisle_width"": {
            ""feet"": ""The minimum aisle width required in the parking area, measured in feet.""
            },
            ""curbing_requirements"": {
            ""summary"": ""A description of the curbing standards and specifications for the parking lot.""
            },
            ""striping_requirements"": {
            ""summary"": ""A summary of the requirements for parking lot striping, including layout and dimensions.""
            },
            ""drainage_requirements"": {
            ""summary"": ""A summary of the drainage standards that must be met within the parking area.""
            },
            ""parking_stalls_required"": {
            ""summary"": ""A description of the number or configuration of parking stalls required, including any specifics such as ADA stalls.""
            }
        },
        ""signage_requirements"": {
            ""permitted_sign_types"": {
            ""summary"": ""A summary of the types of signs that are allowed under the zoning or planning guidelines.""
            },
            ""prohibited_sign_types"": {
            ""summary"": ""A summary of the types of signs that are not allowed under the zoning or planning guidelines.""
            },
            ""design_requirements"": {
            ""summary"": ""A description of the design requirements for signage, including specifications on size, color, and shape.""
            }
        }
}"
        """
    },
    "entitlements": {
        "title_finding_hint": """
            Look for the appropriate titles in the table of contents that include development standards. Development standards are often labeled under different titles depending on the municipality such as:
                • “Land Use"
                • “Zoning Code"
                • “Land Use Code"
                • “Unified Development Ordinance (UDO)"
                • “Unified Development Code (UDC)"
                • “Comprehensive Zoning Ordinance"
                • “Development Code"
                • “Planning and Zoning Code"
                • “Subdivision and Zoning Ordinance"
                • “Land Development Code"
                • “Municipal Zoning Ordinance"
                • “Zoning and Subdivision Regulations"
                • “Land Use Ordinance"
                • “Building and Zoning Code"
                • “Urban Development Code"
        """,
        
        "section_finding_hint": """
                • PRE-APPLICATION MEETING: Looking for information on initial consultation with city staff to discuss project feasibility. 
                • REZONING OR PLATTING: Get all sections that include the word PLAT. Also look for sections that have the following words or similar to: 'Approval Process / Procedure', 'Initial Development Review', 'Conceptual Plan Review', 'Sketch Plan'.
                • PUBLIC HEARINGS: Looking for steps for community input and formal review by planning commissions or city councils.
                • FINAL APPROVALS: Looking for steps for Administrative or commission-level decisions required before permits can be issued.
                • APPROVAL PROCEDURES: Looking for steps for obtaining approval for a project. Look for sections such as "Entitlements Process", "Site Plan Review", "Plan Approval Process", "Subdivision Regulations", "Rezoning Procedures", "Development Review Process", "Application Requirements".             
             """,
                    
        "verification_hint": """
            Below is the information we will want to find from sections that include the following subtopics.
            
            <SUBTOPIC> PRE-APPLICATION MEETING </SUBTOPIC>: We will want to know if this meeting is required by the jurisdiction. If it is required, what documents need to be brought to this meeting and what will the next step be? And what costs are associated with submitting an application or any part of this step.
            <SUBTOPIC> SKETCH PLAN REVIEW/SITE PLAN REVIEW/SCHEMATIC DESIGN REVIEW </SUBTOPIC>: It will be important to know what is required on the site plan. Some examples include: Required contour lines, legal description, development firm contact information, names of existing roadways, utility plan, etc.
            <SUBTOPIC> REZONING PROCEDURE </SUBTOPIC>: Should we want to rezone it will be important to know the cost of the process, what the steps are, and how long it takes. Knowing the rezone process steps is the most important item to know here. This can be listed out in bullet points.
            <SUBTOPIC> PRELIMINARY PLAT APPROVAL </SUBTOPIC>: We will want to know the platting procedure for the preliminary plat, this includes all documents associated with the process and the requirements for each of those documents.
            <SUBTOPIC> CONSTRUCTION PLAN REVIEW </SUBTOPIC>: We will want to know all of the requirements of the construction documents for when we get to this point. A few examples of items that typically are asked to be on the construction documents: existing structures and conditions and elevations, proposed elevations and proposed structures and proposed utilities. We will want the complete list of requirements for the construction documents if it is shown in the code.
            <SUBTOPIC> SECONDARY PLAT APPROVAL/FINAL APPROVAL </SUBTOPIC>: We want the process and all requirements for any final approval or secondary plat.
            Not all of these steps are required by each municipality. But listing the process out for each applicable step (including any required documents or fees that are required) will be the desired output for these steps.
         """,
        
        "examples": """
           
        """,
        
        "expected_output": """
            
        """,
    },
    
}
