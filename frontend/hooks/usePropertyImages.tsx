import { useState, useEffect } from 'react';

interface PropertyImage {
  url: string;
  source: string;
  alt: string;
}

export const usePropertyImages = (propertyAddress: string | null) => {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyAddress) {
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/property-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: propertyAddress }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch property images');
        }

        const data = await response.json();
        setImages(data.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property images');
        // Fallback to default images if API fails
        setImages([
          {
            url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
            source: 'Unsplash',
            alt: 'Modern residential property exterior',
          },
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            source: 'Unsplash',
            alt: 'Luxury home interior',
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
            source: 'Unsplash',
            alt: 'Property backyard view',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [propertyAddress]);

  return { images, loading, error };
}; 