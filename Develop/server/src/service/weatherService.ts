import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();


class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private APIkey = process.env.API_KEY || '';

  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/weather?q=${city}&appid=${this.APIkey}&units=imperial`;
  }

  async getWeatherForCity(city: string) {
    try {
      const url = this.buildGeocodeQuery(city);
      const response = await fetch(url);
      const data = await response.json() as {
        cod: number;
        main: { temp: number; humidity: number };
        wind: { speed: number };
        weather: { description: string }[];
        message?: string;
      };

      if (data.cod === 200) {
        return {
          temperature: data.main.temp,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          description: data.weather[0].description,
        };
      } else {
        console.error('Error fetching weather data:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }
}

export default new WeatherService();
