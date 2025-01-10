const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for the `auth` cookie
    const auth = req.headers.cookie?.split('; ').find(cookie => cookie.startsWith('auth='));
    if (!auth || auth.split('=')[1] !== 'true') {
        return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
    }

    const { sheetId } = req.query;
    const apiKey = process.env.gsapi;

    if (!sheetId) {
        return res.status(400).json({ error: 'Sheet ID is required' });
    }

    console.log('Using API Key:', apiKey); // Debug: Verify API key

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
