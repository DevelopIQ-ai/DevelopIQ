import { NextResponse } from 'next/server';

const NEXT_PUBLIC_GOOGLE_API_KEY_MAPS = process.env.NEXT_PUBLIC_GOOGLE_API_KEY_MAPS;

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json(
        { error: 'Property address is required' },
        { status: 400 }
      );
    }

    if (!NEXT_PUBLIC_GOOGLE_API_KEY_MAPS) {
      return NextResponse.json(
        { error: 'Google API key is not configured' },
        { status: 500 }
      );
    }

    // First, geocode the address to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${NEXT_PUBLIC_GOOGLE_API_KEY_MAPS}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status !== 'OK' || !geocodeData.results[0]?.geometry?.location) {
      return NextResponse.json(
        { error: 'Could not find location for the given address' },
        { status: 400 }
      );
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;

    // Get Street View metadata to check if Street View is available
    const metadataUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${NEXT_PUBLIC_GOOGLE_API_KEY_MAPS}`;
    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    if (metadata.status !== 'OK') {
      return NextResponse.json(
        { error: 'Street View is not available for this location' },
        { status: 404 }
      );
    }

    // Generate Street View images from different angles
    const images = [
      {
        url: `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&heading=0&pitch=0&key=${NEXT_PUBLIC_GOOGLE_API_KEY_MAPS}`,
        source: 'Google Street View',
        alt: 'Front view of property',
      },
      {
        url: `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&heading=90&pitch=0&key=${NEXT_PUBLIC_GOOGLE_API_KEY_MAPS}`,
        source: 'Google Street View',
        alt: 'Right side view of property',
      },
      {
        url: `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&heading=180&pitch=0&key=${NEXT_PUBLIC_GOOGLE_API_KEY_MAPS}`,
        source: 'Google Street View',
        alt: 'Back view of property',
      },
      {
        url: `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&heading=270&pitch=0&key=${NEXT_PUBLIC_GOOGLE_API_KEY_MAPS}`,
        source: 'Google Street View',
        alt: 'Left side view of property',
      },
    ];

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching property images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property images' },
      { status: 500 }
    );
  }
} 