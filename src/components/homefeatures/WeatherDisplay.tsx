import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Droplets, Thermometer, MapPin, Loader2 } from 'lucide-react';
import { getWeatherData, WeatherData } from '@/lib/services/weatherService';
import useLocation from '@/hooks/use-location';

export default function WeatherDisplay() {
  const { location, loading: isLocating, error: locationError, getLocation } = useLocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    if (location && !isLoadingWeather) {
      const fetchWeather = async () => {
        setIsLoadingWeather(true);
        setWeatherError(null);
        try {
          const data = await getWeatherData(location.latitude, location.longitude);
          setWeatherData(data);
        } catch (error: any) {
          setWeatherError(error.message || "Failed to fetch weather data.");
          console.error("Error fetching weather data:", error);
        } finally {
          setIsLoadingWeather(false);
        }
      };
      fetchWeather();
    } else if (locationError) {
      setWeatherError(locationError);
    }
  }, [location, locationError]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-green-800">Live Weather & Season</h2>
        <Cloud className="w-6 h-6 text-blue-500" />
      </div>

      {isLocating || isLoadingWeather ? (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader2 className="animate-spin mr-2" />
          <p>Loading weather data...</p>
        </div>
      ) : weatherError ? (
        <div className="text-center py-8 text-red-500">
          <p>Error: {weatherError}</p>
          <Button onClick={getLocation} className="mt-4">Try Detect Location Again</Button>
        </div>
      ) : weatherData && location ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {location.address || `Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)}`}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2 flex items-center">
              <Thermometer className="w-6 h-6 mr-2" />
              {weatherData.temperature}°C
            </p>
            <p className="text-md text-gray-700 flex items-center">
              <Cloud className="w-5 h-5 mr-1" />
              {weatherData.conditions}, Humidity: {weatherData.humidity}%
            </p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Seasonal Advice:</h3>
            <p className="text-gray-700 text-sm">{weatherData.plantingAdvice}</p>
          </div>

          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">5-Day Forecast:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}:</span>
                    <span>{day.temperature}°C, {day.conditions}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">Weather data helps with planting advice.</p>
          <Button onClick={getLocation}>Detect My Location</Button>
        </div>
      )}
    </Card>
  );
} 