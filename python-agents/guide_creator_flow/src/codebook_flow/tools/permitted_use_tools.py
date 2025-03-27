# from typing import Type, Tuple, Dict, Any, Optional
# from crewai.tools import BaseTool
# from pydantic import BaseModel, Field
# from bs4 import BeautifulSoup
# import re
# import json
# import os

# # Tool 1: Table of Contents Extractor Tool
# class PermittedUseExtractorInput(BaseModel):
#     """Input schema for PermittedUseExtractorTool."""
#     permitted_use_html: str = Field(..., description="The HTML of the permitted use section to parse")
#     use_limitation: str = Field(..., description="The use limitation code to extract")

# class PermittedUseExtractorTool(BaseTool):
#     name: str = "permitted_use_extractor_tool"
#     description: str = "Extracts detailed permitted use table from an HTML document"
#     args_schema: Type[BaseModel] = PermittedUseExtractorInput

#     def _get_csv_from_html(self, html: str) -> str:
#         """
#         Extracts the CSV data from the HTML document.
        
#         Args:
#             html (str): The HTML document to extract CSV from.
        
#         Returns:
#             str: The CSV data from the HTML document
#         """
import base64
import os
from google import genai
from google.genai import types


def generate(permitted_use_html):
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""
                                    {permitted_use_html}

                                    This is data for a permitted use table represented by sets of rows. Please turn it into something akin to a CSV file using the structured output where each row is the comma-separated string. Return an array of rows. Do not skip any rows.
                                    """)
            ],
        )
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
            type = genai.types.Type.OBJECT,
            properties = {
                "rows": genai.types.Schema(
                    type = genai.types.Type.ARRAY,
                    items = genai.types.Schema(
                        type = genai.types.Type.STRING,
                    ),
                ),
            },
        ),
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

    


    # def _run(self, permitted_use_html: str, use_limitation: str) -> dict:
    #     """
    #     Extract detailed permitted use table from an HTML document.
        
    #     Returns:
    #         dict: A detailed hierarchical structure of the permitted use table
    #     """
    #     return None

if __name__ == "__main__":
    generate()