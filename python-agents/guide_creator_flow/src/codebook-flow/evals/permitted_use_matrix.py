import patronus
from patronus import RemoteEvaluator
from patronus import init

class PermittedUseMatrixEval:
    def evaluate(self, result, html_document_id):
        """
        Evaluate the relevance of the answer provided by the extraction crew.
        
        Args:
            result: The raw result from the extraction crew
            html_document_id: The ID of the HTML document being processed
            
        Returns:
            The evaluation result object
        """
        task_input = "Analyze municipal code structures to identify and extract the most relevant sections based on Permitted Use Matrix."
        
        # Construct the task context with the proper HTML document ID
        task_context = self._get_task_context(html_document_id)
        
        # The ideal answer
        gold_answer = """[
            {
                "section_number": "154.039",
                "section_title": "PERMITTED USES",
                "relevance_score": 10,
                "reason": "This section specifically addresses permitted uses, directly relating to the user's inquiry about the Permitted Use Matrix.",
                "content": "§ 154.039  PERMITTED USES.\n\n(A)\xa0\xa0\xa0Applicability. Buildings, structures, or land must only be used in a manner permitted in the zoning districts where they are located. Buildings or structures must be erected, reconstructed, or structurally altered in compliance with this chapter.\n(B)\xa0\xa0\xa0Land use specified. Each land use is classified as a permitted, not permitted, or a special exception use for each zoning district in the use tables of this chapter (the \"Use Table\") or elsewhere in this chapter.\n(C)\xa0\xa0\xa0Special exception uses. A special exception use requires a greater degree of review because of its potential impact upon the immediate neighborhood and the community. The BZA reviews a special exception petition's characteristics and impacts to determine its suitability in each location for those Zoning Districts in which it is permitted. Special exception approval is subject to a public hearing and review by the BZA (see § 154.180(H)).\n(D)\xa0\xa0\xa0Unlisted or questionable land uses. If a land use is not specifically listed on the Permitted Use Table, the Administrator determines the land use classification of the use. This determination is appealable to the BZA (see § 154.180(C)).\n(E)\xa0\xa0\xa0Primary use classifications, categories and specific use types.\n(1)\xa0\xa0\xa0Primary use classifications. All primary land uses in the Permitted Use Table are organized into one of the following five general land use classifications:\n(a)\xa0\xa0\xa0Residential uses;\n(a)\xa0\xa0\xa0Civic, public and institutional uses;\n(b)\xa0\xa0\xa0Commercial sales, service and repair uses;\n(c)\xa0\xa0\xa0Industrial, manufacturing and wholesale uses;\n(d)\xa0\xa0\xa0Agriculture.\n(2)\xa0\xa0\xa0Primary use categories and specific use types. Primary uses are further organized into use categories and specific use types under each general classification. The Permitted Use Table is organized into the above five general land use classifications, use categories and specific use types.\n(3)\xa0\xa0\xa0Classifications and categories are mutually exclusive. The general land use classifications and use categories listed in the Permitted Use Table are mutually exclusive. For example, the use \"Lodging Accommodations,\" cannot be classified in a different use category, such as \"Group Living,\" unless otherwise expressly allowed by this chapter.\n(F)\xa0\xa0\xa0Explanation of table cell entries. Each of the cells on the Permitted Use Table indicates whether a use is permitted or not and what limitations apply to the specific use. Items listed in the Use Limitations column refer to conditions for a specific use (see § 154.040).\n(1)\xa0\xa0\xa0Permitted use (\"P\"). A \"P\" in a table cell indicates the use is permitted in the respective zone district and subject to compliance with the use limitations referenced in the second column of the Permitted Use Table (Use Limitation Notes).\n(2)\xa0\xa0\xa0Use not permitted (blank cell). A blank table cell indicates the use is not permitted in the zone district.\n(3)\xa0\xa0\xa0Use subject to special exception review (\"S\"). An \"S\" in a table cell indicates the use is generally appropriate in the neighborhood context and zone district. Special exception uses may have the potential for limited impacts on adjacent properties or on the established character of the neighborhood context or zone district. \"S\" uses are subject to BZA public hearing according to special exception review, which grants the BZA the authority to impose conditions on the specified use to mitigate any potential impacts. Such uses must comply with any applicable use limitations noted in the condition column of the Permitted Use Table Use Limitation Notes), as well as the review criteria stated in § 154.180.\n(Ord. 2022-17, passed 7-19-2022)"
            },
            {
                "section_number": "154.040",
                "section_title": "PERMITTED USE TABLE",
                "relevance_score": 10,
                "reason": "The Permitted Use Table provides a systematic overview of what uses are allowed in different zoning districts, making it a crucial document for understanding land use regulations.",
                "content": "§ 154.040  PERMITTED USE TABLE.\n\nP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)RESIDENTIAL PRIMARY USES\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)RESIDENTIAL PRIMARY USES\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tHousehold Living\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tDwelling - Single-Family Detached: StandardPPPPPPPSPMin. 2 spaces/unitDwelling - Single-Family Detached: CompactSPPPSPMin\xa0\xa0\xa0. 2 spaces/unitDwelling - DuplexSPPPSPMin. \xa0\xa0\xa0.1.25 spaces/unitDwelling - Bungalow CourtSPPPPMin. 1.25 spaces/unitDwelling - TownhouseSPPPPMin. 1.25 spaces/unitDwelling - Apartment Building: SmallSPPPPMin. 1.25 spaces/unitDwelling - Apartment Building: LargePPPMin. 1.25 spaces/unitAccessory Dwelling Unit§154.060PPPPPPPSPMin. 1 space/unitLive/Work Dwelling§154.041(A)PPMin. 1.25 spaces/unitManufactured Home Parks§154.067Min. 2 spaces/unit\n\nP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)RESIDENTIAL PRIMARY USES (CONT’D)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)RESIDENTIAL PRIMARY USES (CONT’D)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tHousehold Living (Cont’d)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tResidence for Older AdultsSPPMin. 0.75 spaces/unitUpper Story ResidentialPPPMin. 1 space/unitGroup Living\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\tAssisted Living FacilitiesSPPSP0.83 spaces/unitChildcare HomePPPPPPPSS0.28 spaces/unitFraternity, Sorority, or Student HousingSS1.38 spaces/unitGroup Residential FacilitySSSSS0.28 spaces/unitNursing Home, HospiceSSSP0.83 spaces/unitRooming or Boarding HouseSSSS5.5 spaces/1,000 sq. ft. GFA\nP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)CIVIC, PUBLIC, AND INSTITUTIONAL PRIMARY USES\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)CIVIC, PUBLIC, AND INSTITUTIONAL PRIMARY USES\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tBasic Utilities\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tUtility, Major Impact§154.041(B)SPSP.55 spaces/1,000 sq. ft. GFAUtility, Minor Impact§154.041(C)SSPSPSS.55 spaces/1,000 sq. ft. GFACommunity/Public Services\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tCemetery§154.041(D)PPPP1.1 spaces/1,000 sq. ft. GFAChildcare Facilities§154.063SSPSSP1.1 spaces/1,000 sq. ft. GFACommunity Center§154.041(E)SPPPPPPPPPSP.55 spaces/1,000 sq. ft. GFACorrectional Institution§154.041(II)SS4.4 spaces/1,000 sq. ft. GFAFairgroundsSSSNo requirement\nP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)CIVIC, PUBLIC, AND INSTITUTIONAL PRIMARY USES (CONT’D)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)CIVIC, PUBLIC, AND INSTITUTIONAL PRIMARY USES (CONT’D)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tEducation (Cont’d)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tVocational SchoolsPPSP1.1 spaces/1,000 sq. ft. GFAPublic and Religious Assembly\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tBanquet Facilities and Reception Halls§154.041(G)SPSP.55 spaces/1,000 sq. ft. GFAClub or Lodge§ 154.041(G)PPS.55 spaces/1,000 sq. ft. GFAPlaces of Worship§ 154.041(G)SSSSSSSPSPSP.55 spaces/1,000 sq. ft. GFAPublic and Religious Assembly, All Others§ 154.041(G)PSPSP.55 spaces/1,000 sq. ft. GFA\nP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)COMMERCIAL SALES, SERVICES, AND REPAIR PRIMARY USES (CONT'D)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)COMMERCIAL SALES, SERVICES, AND REPAIR PRIMARY USES (CONT'D)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tEating and Drinking Establishments (Cont’d)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tRestaurants - Class B (counter service)PPPSSPP5.5 spaces/1,000 sq. ft. GFARestaurants - Class C (counter service w/drive-thru)SSPPSSP5.5 spaces/1,000 sq. ft. GFATavernsSPPS5.5 spaces/1,000 sq. ft. GFAWinery and MicrobreweryPSPS5.5 spaces/1,000 sq. ft. GFAVehicle/Equipment Sales Service and Repair\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\tP = Permitted UseS = Special ExceptionUse LimitationAGR-RR-1R-2R-3R-4R-5C-1C-2C-3I-1I-2I-3DTMUParking Maximums (except as noted)\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\n(Ord. 2022-17, passed 7-19-2022)"
            }
        ]"""

        # Initialize the Patronus evaluator
        init()
        evaluator = RemoteEvaluator("answer-relevance", "patronus:answer-relevance")
        
        return evaluator.evaluate(
            task_input=task_input,
            task_context=task_context,
            task_output=result,
            gold_answer=gold_answer
        )
    
    def _get_task_context(self, html_document_id):
        """
        Returns the task context template with the HTML document ID inserted.
        
        Args:
            html_document_id: The ID of the HTML document
            
        Returns:
            The complete task context string
        """
        
        return f"""
            find_and_extract_sections:
                description: >
                    <GOAL>
                    Examine the provided JSON structure representing a list of titles, labeled as "title_list".
                    The user is looking for information about: "Permitted Use Matrix".
                    </GOAL>

                    <STEPS>
                    Step 1: determine which title in the list is most relevant to this topic.
                    Step 2: extract the detailed table of contents for the title you have chosen. You can use the table_of_contents_extractor_tool to do this.
                    Step 3: identify 2-3 of the most relevant sections from this table of contents. 
                    Step 4: extract the complete content of the sections you have identified. You can use the section_extractor_tool to do this.
                    </STEPS>
                    
                    <HINTS>
                    Industry Expert Hint for finding information about Permitted Use Matrix:
                        Hint 1: If looking at a title list, the title is usually something to do with zoning or land use. Its also usually a later title, towards the end of the book.
                        Hint 2: If looking for sections, look for sections that are titled "Permitted Uses", "Use Table", "Land Use Matrix", "Zone Districts", or similar.
                    </HINTS>

                    <JSON_STRUCTURE>
                    List of titles:
                    [
                        {{
                            'title': 'TOWN OF BARGERSVILLE, INDIANACODE OF ORDINANCES',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-0'
                        }},
                        {{
                            'title': 'ADOPTING ORDINANCE',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-1'
                        }},
                        {{
                            'title': 'TITLE I: GENERAL PROVISIONS',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-2'
                        }},
                        {{
                            'title': 'TITLE III: ADMINISTRATION',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-3'
                        }},
                        {{
                            'title': 'TITLE V: PUBLIC WORKS',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-4'
                        }},
                        {{
                            'title': 'TITLE VII: TRAFFIC CODE',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-5'
                        }},
                        {{
                            'title': 'TITLE IX: GENERAL REGULATIONS',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-6'
                        }},
                        {{
                            'title': 'TITLE XI: BUSINESS REGULATIONS',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-7'
                        }},
                        {{
                            'title': 'TITLE XIII: GENERAL OFFENSES',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-8'
                        }},
                        {{
                            'title': 'TITLE XV: LAND USAGE',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-9'
                        }},
                        {{
                            'title': 'TABLE OF SPECIAL ORDINANCES',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-10'
                        }},
                        {{
                            'title': 'PARALLEL REFERENCES',
                            'type': 'Title',
                            'level': 0,
                            'id': 'title-11'
                        }}
                    ]
                    </JSON_STRUCTURE>

                    <HTML DOCUMENT ID>
                        HTML document ID:
                        {html_document_id}
                    </HTML DOCUMENT ID>

                    <PERMITTED USE MATRIX>

                        | Land Use                | Residential (R) | Commercial (C) | Industrial (I) | Mixed-Use (MU) | Agricultural (A) |
                        |-------------------------|-----------------|----------------|----------------|----------------|------------------|
                        | Single-Family Housing   | Permitted       | Not Allowed    | Not Allowed    | Permitted      | Permitted        |
                        | Multi-Family Housing    | Permitted       | Not Allowed    | Not Allowed    | Permitted      | Not Allowed      |
                        | Retail Store            | Not Allowed     | Permitted      | Not Allowed    | Permitted      | Not Allowed      |
                        | Office Building         | Not Allowed     | Permitted      | Not Allowed    | Permitted      | Not Allowed      |
                        | Manufacturing Facility  | Not Allowed     | Not Allowed    | Permitted      | Not Allowed    | Not Allowed      |
                        | Warehouse/Distribution  | Not Allowed     | Not Allowed    | Permitted      | Not Allowed    | Not Allowed      |
                        | Restaurant              | Not Allowed     | Permitted      | Not Allowed    | Permitted      | Not Allowed      |
                        | Hotel                   | Not Allowed     | Permitted      | Not Allowed    | Permitted      | Not Allowed      |
                        | School                  | Permitted       | Permitted      | Not Allowed    | Permitted      | Not Allowed      |
                        | Hospital/Clinic         | Permitted       | Permitted      | Not Allowed    | Permitted      | Not Allowed      |
                        | Park/Open Space         | Permitted       | Permitted      | Permitted      | Permitted      | Permitted        |
                        | Farming/Livestock       | Not Allowed     | Not Allowed    | Not Allowed    | Not Allowed    | Permitted        |
                        
                    </PERMITTED USE MATRIX>

                expected_output: >
                    Return a JSON array of the sections you have extracted, ordered by relevance, including both the section 
                    metadata and the complete extracted content. At least one of the sections you extract must be about the Permitted Use Matrix, with the content being semantically related to the Permitted Use Matrix.
                    The output must follow this exact format:
                    [
                    {{{{
                        "section_number": "The section number (e.g. '151.027')",
                        "section_title": "The title of the section without the section number",
                        "relevance_score": A number from 1-10 indicating relevance (10 being highest),
                        "reason": "A brief explanation of why this section is relevant",
                        "content": "The full extracted content of the section"
                    }}}}
                    ]
                agent: municipal_code_section_extractor
            """
