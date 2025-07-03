import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  climateZone?: string;
}

interface UseLocationResult {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  getLocation: () => void;
}

const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      // Placeholder for a real geocoding API call
      // In a real application, you would use a service like Google Maps Geocoding API, OpenStreetMap Nominatim, etc.
      // For this example, we'll return mock data.
      const response = await fetch(`https://api.example.com/geocode?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();

      // Mocking a successful response
      const mockAddressData = {
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        country: "USA",
        zipCode: "90210",
        climateZone: "Zone 10a", // Example climate zone
      };
      
      return mockAddressData;

    } catch (err) {
      console.error("Error during reverse geocoding:", err);
      return {};
    }
  };

  const determineClimateZone = (latitude: number): string => {
    // This is a simplified example. A real implementation would use a robust climate zone API or dataset.
    if (latitude >= 25 && latitude <= 35) return "Zone 9-10";
    if (latitude > 35 && latitude <= 45) return "Zone 7-8";
    if (latitude > 45) return "Zone 3-6";
    return "Unknown Zone";
  };

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const addressData = await reverseGeocode(latitude, longitude);
          const climateZone = determineClimateZone(latitude);

          setLocation({
            latitude,
            longitude,
            ...addressData,
            climateZone,
          });
          setLoading(false);
        },
        (geoError) => {
          setError(geoError.message);
          toast({
            title: "Location Error",
            description: geoError.message,
            variant: "destructive",
          });
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally get location on mount, or leave it to be triggered by a user action
    // getLocation(); 
  }, []);

  return { location, loading, error, getLocation };
};

export default useLocation; 