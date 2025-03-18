import requests
import json
from typing import Dict, Any
import mapbox_vector_tile
import math
from shapely.geometry import Point, Polygon

# Constants
latitude = 39.952444
longitude = -75.165242

address = "1500 Market St, Philadelphia, PA"

# Replace with your actual API key
API_KEY = "594a56ce908e3b821483fa5c9f959978a43bb93e"
BASE_URL = "https://api.zoneomics.com/v2"

def make_api_call(endpoint: str, params: Dict[str, Any]) -> Dict:
    """Make an API call to Zoneomics endpoint"""
    headers = {
        "Content-Type": "application/json"
    }
    
    url = f"{BASE_URL}/{endpoint}"
    full_url = requests.Request('GET', url, params=params).prepare().url
    print(f"Making API call to: {full_url}")
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.content
        return data
    else:
        return {
            "error": f"API call failed with status code {response.status_code}",
            "details": response.text
        }
    
def decode_mvt_data(mvt_data):
    """Decode MVT data to extract zoning information"""
    # Parse the MVT binary data
    decoded_data = mapbox_vector_tile.decode(mvt_data)
    
    # Extract zoning information from the tile
    if 'zones' in decoded_data:
        zones = decoded_data['zones']
        
        # Just for informational purposes, print all zones in the tile
        print("All zones in this tile:")
        for feature in zones['features']:
            properties = feature.get('properties', {})
            print(f"Zone Code: {properties.get('zone_code')}")
            print(f"Zone Name: {properties.get('zone_name')}")
            print(f"Zone Type: {properties.get('zone_type')}")
            print(f"Zone Subtype: {properties.get('zone_sub_type')}")
            print("---")
        
        return zones
    else:
        return {"error": "No zoning data found in the tile"}

def long2tile(lon, zoom):
    return math.floor((lon + 180) / 360 * pow(2, zoom))

def lat2tile(lat, zoom):
    return math.floor((1 - math.log(math.tan(lat * math.pi / 180) + 1 / math.cos(lat * math.pi / 180)) / math.pi) / 2 * pow(2, zoom))

def lon_to_pixel_x(lon, zoom, tile_x):
    # Convert longitude to fractional tile coordinate
    x = (lon + 180) / 360 * pow(2, zoom)
    # Calculate pixel coordinate within tile (tile size is 4096 pixels)
    return int((x - tile_x) * 4096)
    
def lat_to_pixel_y(lat, zoom, tile_y):
    # Convert latitude to fractional tile coordinate
    y = (1 - math.log(math.tan(lat * math.pi / 180) + 1 / math.cos(lat * math.pi / 180)) / math.pi) / 2 * pow(2, zoom)
    # Calculate pixel coordinate within tile (tile size is 4096 pixels)
    return int((y - tile_y) * 4096)

def get_zoning_for_location():
    """Get zoning information for a specific latitude/longitude"""
    zoom = 17
    tile_x = long2tile(longitude, zoom)
    tile_y = lat2tile(latitude, zoom)
    
    print(f"Tile coordinates: x={tile_x}, y={tile_y}, z={zoom}")
    
    # Get the tile data
    params = {
        "api_key": API_KEY,
        "x": tile_x,
        "y": tile_y,
        "z": zoom
    }
    mvt_data = make_api_call("tiles", params)
    
    # Decode the tile data
    zones = decode_mvt_data(mvt_data)
    
    # Convert lat/lon to pixel coordinates within the tile
    pixel_x = lon_to_pixel_x(longitude, zoom, tile_x)
    pixel_y = lat_to_pixel_y(latitude, zoom, tile_y)
    point = Point(pixel_x, pixel_y)
    
    print(f"Pixel coordinates within tile: x={pixel_x}, y={pixel_y}")
    
    # Check which polygon contains the point
    for feature in zones['features']:
        geometry = feature['geometry']
        properties = feature['properties']
        
        if geometry['type'] == 'Polygon':
            polygon = Polygon(geometry['coordinates'][0])
            if polygon.contains(point):
                print("\nFOUND ZONING MATCH FOR YOUR LOCATION:")
                print(f"Zone Code: {properties.get('zone_code')}")
                print(f"Zone Name: {properties.get('zone_name')}")
                print(f"Zone Type: {properties.get('zone_type')}")
                print(f"Zone Subtype: {properties.get('zone_sub_type')}")
                return properties
                
        elif geometry['type'] == 'MultiPolygon':
            for polygon_coords in geometry['coordinates']:
                polygon = Polygon(polygon_coords[0])
                if polygon.contains(point):
                    print("\nFOUND ZONING MATCH FOR YOUR LOCATION:")
                    print(f"Zone Code: {properties.get('zone_code')}")
                    print(f"Zone Name: {properties.get('zone_name')}")
                    print(f"Zone Type: {properties.get('zone_type')}")
                    print(f"Zone Subtype: {properties.get('zone_sub_type')}")
                    return properties
    
    print("No zoning match found for this location. This may occur if:")
    print("1. The coordinates are outside any zoning polygon in the tile")
    print("2. There may be an issue with the coordinate conversion")
    print("3. You might need to try adjacent tiles")
    
    return None

def main():
    print(f"\n=== Finding zoning information for {address} ===")
    print(f"Latitude: {latitude}, Longitude: {longitude}")
    
    # Get zoning for this specific location
    zoning_info = get_zoning_for_location()
    print(zoning_info)
    # You could also add API calls to other endpoints here if needed
    # Such as get_permitted_uses() or get_development_standards()

if __name__ == "__main__":
    main()