import { Router } from 'express';
const router = Router();
import historyService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// POST request to retrieve weather data for a city
router.post('/', async (req, res) => {
    try {
        const { city } = req.body;
        if (!city) {
            return res.status(400).json({ message: 'City name is required' });
        }
        // Get weather data for the city
        const weatherData = await WeatherService.getWeatherForCity(city);
        if (weatherData) {
            await historyService.addCity({ name: city, id: `${Date.now()}` });
            return res.status(200).json({
                message: `Weather data for ${city}`,
                data: weatherData,
            });
        }
        else {
            return res.status(404).json({ message: `City ${city} not found` });
        }
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// GET request to fetch search history
router.get('/history', async (_req, res) => {
    try {
        const cities = await historyService.getCities();
        res.status(200).json({ message: 'Search history', data: cities });
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// DELETE request to remove a city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await historyService.removeCity(id);
        if (success) {
            res.status(200).json({ message: `City with id ${id} removed from history` });
        }
        else {
            res.status(404).json({ message: `City with id ${id} not found` });
        }
    }
    catch (error) {
        console.error('Error deleting city from search history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
