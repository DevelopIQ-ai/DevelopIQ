import httpx
import asyncio
from supabase import create_client
import os

from dotenv import load_dotenv
load_dotenv()

def get_full_fips(supabase_client, county_name, state_abbr):
    """
    Get the FIPS code for a county from the Supabase database.
    
    Parameters:
    -----------
    supabase_client : supabase.Client
        Initialized Supabase client
    county_name : str
        Name of the county (case-insensitive partial match)
    state_abbr : str
        Two-letter state abbreviation (case-insensitive exact match)
            
    Returns:
    --------
    str or None
        FIPS code as string or None if not found
    """
    try:
        # Use ILIKE for case-insensitive matching for both county and state
        response = supabase_client.table("Catwalk_2023_dups").select(
            "fips_code"
        ).ilike("county", f"%{county_name}%").ilike("state", state_abbr).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]['fips_code']
        else:
            return None
                
    except Exception as e:
        print(f"Error querying Supabase: {e}")
        return None
    

def get_laus_series_id(supabase_client, county_name, state_abbr, query_type):
    """
    Construct a BLS series ID for Local Area Unemployment Statistics (LAUS) data.
    
    Parameters:
    -----------
    supabase_client : supabase.Client
        Initialized Supabase client
    county_name : str
        Name of the county (partial match supported)
    state_abbr : str
        Two-letter state abbreviation (exact match required)
    query_type : str
        Type of data to query (e.g., 'unemployment rate', 'unemployment', 'labor force')
        
    Returns:
    --------
    str or None
        Complete BLS series ID or None if county not found or invalid query_type
    """
    # Map query types to their corresponding measure codes
    measure_codes = {
        "unemployment rate": "03",
        "unemployment": "04",
        "employment": "05",
        "labor force": "06",
        "employment-population ratio": "07",
        "labor force participation rate": "08",
        "civilian noninstitutional population": "09"
    }
    
    # Check if the query type is valid
    if query_type.lower() not in measure_codes:
        print(f"Invalid query type: {query_type}")
        return None
    
    try:
        # Get the FIPS code for the county
        fips = get_full_fips(supabase_client, county_name, state_abbr)
        if fips is None:
            print(f"County not found: {county_name}, {state_abbr}")
            return None
        
        # Construct the series ID for Local Area Unemployment Statistics
        # Format: LA + U + CN + [state_fips] + [county_fips] + 0000000 + [measure_code]
        # Where:
        # LA = Prefix for Local Area Unemployment Statistics
        # U = Unadjusted data
        # CN = County indicator (not related to state)
        series_id = f"LAUCN{fips}00000000{measure_codes[query_type.lower()]}"
        
        return series_id
            
    except Exception as e:
        print(f"Error constructing series ID: {e}")
        return None

async def get_bls_timeseries(
    series_id: str, 
    start_year: str, 
    end_year: str, 
) -> str:
    """
    Fetch time series data from the BLS API.
    
    Args:
        series_id: The BLS series ID (e.g., 'LNS14000000' for unemployment rate)
        start_year: The starting year for data (e.g., '2020')
        end_year: The ending year for data (e.g., '2023')
    
    Returns:
        Formatted BLS data as a string
    """
    # Log request for debugging
    # Construct the API request payload
    payload = {
        "seriesid": [series_id],
        "startyear": start_year,
        "endyear": end_year
    }

    BLS_API_KEY = os.getenv("BLS_API_KEY")
    BLS_API_BASE_URL = os.getenv("BLS_API_BASE_URL")
    
    # Add API key if available
    if BLS_API_KEY:
        payload["registrationkey"] = BLS_API_KEY
    
    url = f"{BLS_API_BASE_URL}timeseries/data/"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as e:
            return f"Error fetching data: HTTP error {e.response.status_code}"
        except httpx.RequestError as e:
            return f"Error fetching data: Request error - {str(e)}"
        
        if data.get("status") != "REQUEST_SUCCEEDED":
            error_message = data.get("message", ["Unknown error"])[0]
            return f"BLS API Error: {error_message}"
        
        # Format the results
        results = []
        series_data = data.get("Results", {}).get("series", [])
        
        if not series_data or not series_data[0].get("data"):
            return "No data found for the given parameters."
        
        return extract_unemployment_values(series_data[0])

def extract_unemployment_values(series_entry):
    results = []
    for entry in series_entry.get("data", []):
        year = entry.get("year")
        month = entry.get("period")[1:]  # removes "M" prefix
        value = float(entry.get("value"))
        
        # Check if any footnote has code 'P' (preliminary)
        is_preliminary = any(f.get("code") == "P" for f in entry.get("footnotes", []))

        results.append({
            "year": year,
            "month": month,
            "value": value,
            "preliminary": is_preliminary
        })
    return results
if __name__ == "__main__":
    supabase_client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    print(get_full_fips(supabase_client, "Johnson County", "IN"))
    fips = get_laus_series_id(supabase_client, "Johnson County", "IN", "unemployment rate")
    print(fips)
    response = asyncio.run(get_bls_timeseries(fips, "2024", "2025"))
    print(response)