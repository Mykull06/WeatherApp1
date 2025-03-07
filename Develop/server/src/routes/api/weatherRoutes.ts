import { Router, Request, Response } from 'express';
const router = Router();

import historyService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST request to retrieve weather data for a city
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;

    if (!city || typeof city !== 'string' || city.trim() === '') {
      return res.status(400).json({ message: 'City cannot be blank' });
    }

    const trimmedCity = city.trim();

    console.log(`Fetching weather data for: ${trimmedCity}`);
    
    const weatherData = await WeatherService.getWeatherForCity(trimmedCity);

    if (weatherData && Array.isArray(weatherData)) {
      await historyService.addCity({ name: trimmedCity, id: `${Date.now()}` });
      console.log('Weather data from OpenWeather API:', weatherData);
      return res.status(200).json(weatherData);
    } else {
      console.warn(`Weather data for ${trimmedCity} not found.`);
      return res.status(404).json({ message: `Weather data for ${trimmedCity} not found` });
    }

  } catch (error: any) {
    console.error('Error fetching weather data:', error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET request to fetch search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await historyService.read();
    console.log('Fetched search history:', cities);
    res.status(200).json({ message: 'Search history', data: cities });
  } catch (error: any) {
    console.error('Error fetching search history:', error.message || error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE request to remove a city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    const success = await historyService.removeCity(id);

    if (success) {
      console.log(`City with ID ${id} removed from history.`);
      return res.status(200).json({ message: `City with ID ${id} removed from history` });
    } else {
      console.warn(`City with ID ${id} not found in history.`);
      return res.status(404).json({ message: `City with ID ${id} not found` });
    }
  } catch (error: any) {
    console.error('Error deleting city from search history:', error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
