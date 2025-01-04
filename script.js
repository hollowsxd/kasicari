document.getElementById('load-sheet').addEventListener('click', function() {
    const sheetUrl = document.getElementById('sheet-url').value.trim();
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = ''; // Clear previous error message
    if (!sheetUrl) {
        errorMessageElement.textContent = 'Please enter a valid Google Sheets URL or ID.';
        return;
    }

    // Display loading message
    document.getElementById('loading').style.display = 'block';

    // Extract the Google Sheet ID from the URL if it's a full URL
    const sheetId = sheetUrl.includes('docs.google.com/spreadsheets/d/') ?
        sheetUrl.split('/d/')[1].split('/')[0] : sheetUrl;

    // Check if the sheet ID is valid (simple validation)
    if (!sheetId) {
        document.getElementById('loading').style.display = 'none';
        errorMessageElement.textContent = 'Invalid Google Sheets URL or ID.';
        return;
    }

    // Make API call to fetch the sheet data using Google Sheets API
    fetchSheetData(sheetId);
});

// Function to fetch data from Google Sheets
function fetchSheetData(sheetId) {
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=AIzaSyDoDqTVGQY-8Y-_UqM2nucWJyt_pFe6vIw`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Hide loading message
            document.getElementById('loading').style.display = 'none';

            if (data && data.values && data.values.length > 0) {
                displaySearchBar(data.values);
            } else {
                document.getElementById('error-message').textContent = 'No data found in the sheet.';
            }
        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error-message').textContent = 'Error loading the sheet. Please try again.';
            console.error('Error fetching data:', error);
        });
}

// Function to display the search bar once the sheet is loaded
function displaySearchBar(sheetData) {
    // Store sheet data for searching (in this case, we assume the first column is address/phone number)
    window.sheetData = sheetData.map(row => row[0]);

    // Display search bar and hide the URL input section
    document.getElementById('search-container').style.display = 'block';

    // Set up search functionality
    document.getElementById('search-bar').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredData = window.sheetData.filter(item =>
            item.toLowerCase().includes(query)
        );
        displaySearchResults(filteredData);
    });
}

// Function to display the search results
function displaySearchResults(results) {
    const resultList = document.getElementById('search-results');
    resultList.innerHTML = '';

    if (results.length > 0) {
        results.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = item;
            resultList.appendChild(listItem);
        });
    } else {
        resultList.innerHTML = '<li class="list-group-item">No results found.</li>';
    }
}
