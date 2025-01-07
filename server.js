const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS to allow frontend requests

// Fetch data from Google Sheets
app.get('/fetch-sheet', async (req, res) => {
    const sheetId = req.query.sheetId;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY; // API key stored in environment variable

    if (!sheetId) {
        return res.status(400).json({ error: 'Sheet ID is required' });
    }

    try {
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.values) {
            res.json({ data: response.data.values });
        } else {
            res.status(404).json({ error: 'No data found in the sheet.' });
        }
    } catch (error) {
        console.error('Error fetching Google Sheets:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from Google Sheets.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
