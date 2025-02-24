import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
dotenv.config();
// Import the routes
import routes from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Serve static files of the entire client dist folder
const clientDistFolder = path.resolve(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDistFolder));
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect the routes
app.use(routes);
// Fallback route to serve index.html for any unknown route
app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistFolder, 'index.html'));
});
// Start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
