hints = {

"permitted use matrix": """

Extract the Permitted Use Matrix from the document with extreme detail and precision. This is typically a comprehensive table that outlines what types of land uses are allowed in different zoning districts.

Follow these detailed extraction steps:
1. Identify the section in the document that contains the Permitted Use Matrix. This is likely within zoning or land use chapters, often titled "Permitted Uses", "Use Table", or "Land Use Matrix".

2. For the matrix itself, carefully extract:
   - All column headers (typically zoning districts like R-1, R-2, C-1, I-1, etc.)
   - All row headers (typically use categories like "Residential", "Commercial", "Industrial", etc.)
   - All individual use types (e.g., "Single-family dwelling", "Restaurant", "Manufacturing facility")
   - All permission indicators for each cell (typically "P" for permitted, "C" for conditional, "S" for special, "-" or blank for prohibited)

3. Preserve the hierarchical structure of use categories and subcategories exactly as shown in the original document.

4. Include any footnotes, special conditions, or explanatory notes that apply to specific uses or cells in the matrix.

5. Capture any supplementary information about:
   - Use-specific standards referenced in the matrix
   - How to interpret permission indicators
   - Any overlay districts that modify the base permissions
   - Accessory use provisions related to the matrix

6. Maintain the exact formatting and organization of the data as a structured table with clear relationships between districts and uses.

7. If separate matrices exist for different areas or special districts, extract each one separately and clearly label them.

The output should be a complete, accurately structured representation of the Permitted Use Matrix that preserves all relationships between land uses and zoning districts, including all conditions, exceptions, and explanatory information.
""",

"permitted_use_matrix_extraction_hint": """
    Look for sections that are titled "Permitted Uses", "Use Table", "Land Use Matrix", "Zone Districts", or similar.
"""
} 