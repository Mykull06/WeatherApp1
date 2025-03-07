import fs from 'fs/promises';
//import path from 'path';

const historyFilePath = 'db/db.json';

// Initialize the search history file and directory if not existing
//const initializeSearchHistoryFile = async () => {
   // try {
     //   await fs.mkdir(path.dirname(historyFilePath), { recursive: true });
       // await fs.writeFile(historyFilePath, '[]', { flag: 'wx' });
    //} catch (error: any) {
     //   if (error.code !== 'EEXIST') {
      //      console.error('Error initializing searchHistory.json file:', error);
        //}
    //}
//};

// Call the initialization method at service startup
//initializeSearchHistoryFile();

export default {
    async read() {
        try {
            const data = await fs.readFile(historyFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading cities:', error);
            return [];
        }
    },

    async write(data: any) {
        try {
            await fs.writeFile(historyFilePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving cities:', error);
        }
    },

    async addCity(city: { name: string; id: string }) {
        const cities = await this.read();
        cities.push(city);
        await this.write(cities);
    },

    async removeCity(id: string) {
        try {
            const cities = await this.read();
            const filteredCities = cities.filter((city: { id: string }) => city.id !== id);

            if (cities.length === filteredCities.length) {
                console.warn(`City with ID ${id} not found.`);
                return false;
            }

            await this.write(filteredCities);
            console.log(`City with ID ${id} successfully removed.`);
            return true;
        } catch (error) {
            console.error('Error removing city from history:', error);
            return false;
        }
    }
};
