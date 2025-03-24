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
                    
        "verification_hint": """

        Verify that the section has the following information. 
        It should have one or many categories, such as Residential Primary Uses or Civic, Public and Institutional Primary Uses. 
        These are called Primary Use Classifications. Under each of these, you will have a list of permitted uses and special exceptions.
   
        This information is typically listed out or shown in a tabular format with characters such as "P" representing permitted use or "S" representing Special Exception. 
        Typically when listed out, the permitted uses are listed out under each zoning classification.        
        We will want to return the list of permitted uses corresponding to those for {zone_code}. 
        """,


        "thought_process": """

        """,

        "examples": """
            See the example below for a codebook with {zone_code} set to 'DT':

        <INPUT>
        {'root': {'Permitted Uses': [{'sub_topic': 'Permitted Uses', 'section_number': ['154.039', '154.040'], 'section_title': ['PERMITTED USES', 'PERMITTED USE TABLE'], 'relevance_score': [10, 10], 'reason': ['Defines the uses allowed by right in the RR zoning classification.', 'Provides a table outlining various permitted activities and use classifications.']}]}}
        </INPUT>
        Note: this input is coming from the find_sections task.
        
       <OUTPUT> 

       <THOUGHT PROCESS>
        I understand that I have access to content relating to the permitted use matrix for all zone codes.
        I will now list out all of the primary use classifications.
        <LIST OF PRIMARY USE CLASSIFICATIONS>
        [Residential Primary Uses, Commercial Sales, Services, and Repair Primary Uses, Industrial, Manufacturing, and Wholesale Primary Uses, Agriculture Primary Uses]
        </LIST OF PRIMARY USE CLASSIFICATIONS>
        I will now look at the content and find the column or subsection that relates to zone code {zone_code}.
        For Residential Primary Uses, the column or subsection that relates to zone code {zone_code} is labeled as "DT".
        I will now extract the permitted uses and special exceptions for zone code {zone_code}.
        I see that under the "DT" column, there are several rows that either have a "P", "S" or are blank. I know that "P" represents a permitted use and the "S" represents a special exception. So now I know which rows to extract, and which values to return.
        The rows that have a "P" are:
        Therefore, these must be the permitted uses for zone code {zone_code} for Residential Primary Uses.
        <PERMITTED USES>
        [Dwelling - Bungalow Court, Dwelling - Townhouse, Dwelling - Apartment Building: Small, Dwelling - Apartment Building: Large, Live/Work Dwelling, Upper Story Residential]
        </PERMITTED USES>
        The rows that have a "S" are:
        Therefore, these must be the special exceptions for zone code {zone_code} for Residential Primary Uses.
        <SPECIAL EXCEPTIONS>
        [Dwelling - Single-Family Detached: Standard, Dwelling - Single-Family Detached: Compact, Dwelling - Duplex, Accessory Dwelling Unit, Assissted Living Facilities, Childcare Home, Group Residential Facility, Rooming or Boarding House]
        </SPECIAL EXCEPTIONS>
        I will ignore the rows that have a blank value.
        I have now extracted the permitted uses and special exceptions for zone code {zone_code} for Residential Primary Uses.
        Okay, now I will do this for the remaining primary use classifications.
        The next one to look at is Commercial Sales, Services, and Repair Primary Uses. 
        ... (continue this process for all primary use classifications)
        </THOUGHT PROCESS>
        
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
        
        "section_finding_hint": """
            1. HEIGHT AND AREA REQUIREMENTS (looking for information on setbacks, building height, lot coverage, and lot size)
            2. PARKING REGULATIONS (looking for details on parking stall dimensions, required ADA spaces, and total parking requirements)
            3. LANDSCAPE REQUIREMENTS (looking for standards for tree types, plant sizes, and placement)
            4. FLOOD ZONE REGULATIONS (looking for rules for preventing flood damage in designated areas)
            5. SIGN REQUIREMENTS (looking for rules for what type of signs are permitted and prohibited and design charateristics for signs)       """,
                    
        "verification_hint": """
            • For setbacks key words will appear such as: “front yard,” “side yard,” “rear yard,” or “minimum distance.” Verify that this info
            • For building height: “maximum height,” “vertical envelope,” or “height limits.”
            • For parking: “parking stall dimensions,” “ADA compliance,” or “off-street parking.”
            • For landscaping: “tree canopy,” “planting requirements,” or “screening standards.”
            • For signs: "master sign plan", "comprehensive sign plan", "placement", "quantity", "size", "design".

         """,
        
        "examples": """
           
        """,
        
        "expected_output": """
            Return the development standards
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
