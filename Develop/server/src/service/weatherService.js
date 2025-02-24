import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
class WeatherService {
    constructor() {
        this.baseURL = 'https://api.openweathermap.org/data/2.5';
        this.APIkey = process.env.API_KEY || '';
    }
    buildGeocodeQuery(city) {
        return `${this.baseURL}/weather?q=${city}&appid=${this.APIkey}&units=imperial`;
    }
    async getWeatherForCity(city) {
        try {
            const url = this.buildGeocodeQuery(city);
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                return {
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    wind: data.wind.speed,
                    description: data.weather[0].description,
                };
            }
            else {
                console.error('Error fetching weather data:', data.message);
                return null;
            }
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }
}
export default new WeatherService();
