import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  climateZone?: string;
}

interface LocationStepProps {
  onNext: (data: { location: LocationData }) => void;
  onBack: () => void;
  data: { location?: LocationData };
  location: LocationData | null;
  isLocating: boolean;
  locationError: string | null;
  onDetectLocation: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  onNext,
  onBack,
  data,
  location,
  isLocating,
  locationError,
  onDetectLocation,
}) => {
  const [manualAddress, setManualAddress] = useState(data.location?.address || '');

  useEffect(() => {
    if (location) {
      setManualAddress(location.address || '');
    }
  }, [location]);

  const handleManualSearch = () => {
    // For now, just use the manual address and clear lat/lon
    // A real implementation would call a geocoding API
    // We will assume that if a user manually enters, they know their climate zone or it will be determined later.
    onNext({
      location: {
        latitude: null,
        longitude: null,
        address: manualAddress,
        climateZone: 'Manual Entry',
      },
    });
  };

  const handleSubmit = () => {
    if (location) {
      onNext({ location });
    } else {
      // If location is not detected, but manual address is entered
      handleManualSearch();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        <MapPin className="inline mr-2 h-5 w-5" /> Where are you planning to grow?
      </h2>

      <div className="space-y-2">
        <label htmlFor="manualAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter your address or city
        </label>
        <div className="flex space-x-2">
          <Input
            id="manualAddress"
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="e.g., 123 Main St, Anytown"
            className="flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Button onClick={handleManualSearch} variant="outline" disabled={isLocating || !manualAddress}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </div>

      <Button onClick={onDetectLocation} className="w-full" disabled={isLocating}>
        {isLocating ? 'Detecting...' : 'Use My Current Location'}
      </Button>

      {locationError && <p className="text-sm text-red-600 dark:text-red-400">{locationError}</p>}

      {location && location.address && (
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
          <p className="text-gray-900 dark:text-white"><strong>Selected Location:</strong> {location.address}</p>
          {location.latitude && location.longitude && (
            <p className="text-gray-900 dark:text-white"><strong>Coordinates:</strong> Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}</p>
          )}
          <p className="text-gray-900 dark:text-white"><strong>Climate Zone:</strong> {location.climateZone}</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="outline" disabled={isLocating}> 
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isLocating || (!location && !manualAddress)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;
