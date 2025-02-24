import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface City {
  name: string;
  id: string;
}

// ES Module-compatible way to handle __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct history file path
const historyFilePath = path.resolve(__dirname, '../../../db/searchHistory.json');

class HistoryService {
  private async read(): Promise<City[]> {
    try {
      const cities = await fs.promises.readFile(historyFilePath, 'utf8');
      return JSON.parse(cities) as City[];
    } catch (error) {
      console.error('Error loading cities:', error);
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(
        historyFilePath,
        JSON.stringify(cities, null, 2)
      );
    } catch (error) {
      console.error('Error saving cities:', error);
    }
  }

  async getCities(): Promise<City[]> {
    return this.read();
  }

  async addCity(city: City): Promise<void> {
    const cities = await this.read();
    cities.push(city);
    await this.write(cities);
  }

  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
    return cities.length !== updatedCities.length;
  }
}

export default new HistoryService();
