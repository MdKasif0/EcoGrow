const OPENWEATHER_API_KEY = '9478ff50172fe8457d7532be7ac8aa67';

export interface WeatherData {
  temperature: number;
  humidity: number;
  conditions: string;
  forecast: {
    date: string;
    temperature: number;
    conditions: string;
  }[];
  plantingAdvice: string;
}

export async function getWeatherData(lat: number, lng: number): Promise<WeatherData> {
  try {
    // Get current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    const currentWeather = await currentWeatherResponse.json();

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    const forecast = await forecastResponse.json();

    // Generate planting advice based on weather conditions
    const plantingAdvice = generatePlantingAdvice(currentWeather);

    return {
      temperature: currentWeather.main.temp,
      humidity: currentWeather.main.humidity,
      conditions: currentWeather.weather[0].main,
      forecast: forecast.list.slice(0, 5).map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        conditions: item.weather[0].main
      })),
      plantingAdvice
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}

function generatePlantingAdvice(weather: any): string {
  const temp = weather.main.temp;
  const conditions = weather.weather[0].main.toLowerCase();

  if (temp < 10) {
    return 'Too cold for most plants. Consider indoor planting or wait for warmer weather.';
  } else if (temp > 30) {
    return 'High temperatures. Focus on heat-tolerant plants and ensure adequate watering.';
  } else if (conditions.includes('rain')) {
    return 'Good conditions for planting. Soil will be moist and ready for new plants.';
  } else if (conditions.includes('clear')) {
    return 'Clear weather is good for planting, but ensure proper watering.';
  } else {
    return 'Moderate conditions suitable for most plants. Check specific plant requirements.';
  }
} 