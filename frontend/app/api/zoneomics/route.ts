/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/zoning/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { VectorTile } from "@mapbox/vector-tile";
import Protobuf from "pbf";
import * as turf from "@turf/turf";

const BASE_URL = "https://api.zoneomics.com/v2";
const API_KEY = process.env.ZONEOMICS_API_KEY;

function long2tile(lon: number, zoom: number): number {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

function lat2tile(lat: number, zoom: number): number {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
}

export async function POST(request: Request) {
  try {
    const { latitude, longitude } = await request.json();
    
    if (!latitude || !longitude) {
      console.log("Missing latitude or longitude");
      return NextResponse.json({
        zone_code: null,
        zone_name: null,
        zone_type: null,
        zone_sub_type: null,
        error: "Latitude and longitude are required"
      });
    }

    const zoom = 17;
    const tileX = long2tile(Number(longitude), zoom);
    const tileY = lat2tile(Number(latitude), zoom);
    console.log("Tile coordinates:", { tileX, tileY });
    console.log("Zoom:", zoom);

    const params = {
      api_key: API_KEY,
      x: tileX,
      y: tileY,
      z: zoom
    };

    console.log("Fetching Zoneomics tile for coordinates:", { params });

    const response = await axios.get(`${BASE_URL}/tiles`, {
      params,
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "arraybuffer"
    });

    if (response.status !== 200) {
      return NextResponse.json({
        zone_code: null,
        zone_name: null,
        zone_type: null,
        zone_sub_type: null,
        error: `API call failed with status code ${response.status}`
      });
    }

    // Parse the MVT binary data
    const tile = new VectorTile(new Protobuf(response.data));
    
    if (!tile.layers || !tile.layers.zones) {
      console.log("No zoning layers found in tile");
      return NextResponse.json({
        zone_code: null,
        zone_name: null,
        zone_type: null,
        zone_sub_type: null,
        error: "No zoning data found"
      });
    }

    const zonesLayer = tile.layers.zones;
    let zoningData = null;

    // Find the zoning data for the exact point
    const point = turf.point([Number(longitude), Number(latitude)]);
    
    for (let i = 0; i < zonesLayer.length; i++) {
      const feature = zonesLayer.feature(i);
      const geojson = feature.toGeoJSON(tileX, tileY, zoom);
      
      if (geojson.geometry.type === 'Polygon') {
        const polygon = turf.polygon(geojson.geometry.coordinates);
        if (turf.booleanPointInPolygon(point, polygon)) {
          zoningData = feature.properties;
          break;
        }
      } else if (geojson.geometry.type === 'MultiPolygon') {
        for (const polygonCoords of geojson.geometry.coordinates) {
          const polygon = turf.polygon(polygonCoords);
          if (turf.booleanPointInPolygon(point, polygon)) {
            zoningData = feature.properties;
            break;
          }
        }
      }
    }

    if (!zoningData) {
      console.log("No zoning data found for location");
      return NextResponse.json({
        zone_code: null,
        zone_name: null,
        zone_type: null,
        zone_sub_type: null,
        error: "No zoning data found for this location"
      });
    }
    console.log("Found zoning data:", zoningData);
    return NextResponse.json(zoningData);
  } catch (error) {
    console.error("[ZONEOMICS] API Error:", error);
    return NextResponse.json({
      zone_code: null,
      zone_name: null,
      zone_type: null,
      zone_sub_type: null,
      error: "Failed to fetch zoning data"
    });
  }
}

