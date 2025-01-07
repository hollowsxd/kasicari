const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sheetId } = req.query;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

    if (!sheetId) {
        return res.status(400).json({ error: 'Sheet ID is required' });
    }

    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        return res.status(200).json({ data: response.data.values });
    } catch (error) {
        console.error('Error fetching Google Sheets:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            error: 'Failed to fetch data from Google Sheets.',
            details: error.response?.data || error.message,
        });
    }
};
