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
    // Store sheet data for searching
    window.sheetData = sheetData;

    // Display search bar and hide the URL input section
    document.getElementById('search-container').style.display = 'flex';

    // Set up search functionality
    document.getElementById('search-bar').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredData = window.sheetData.filter(row => {
            return row.some(cell => cell.toLowerCase().includes(query)); // Search through all columns
        });
        displaySearchResults(filteredData);
    });
}

// Function to display the search results
function displaySearchResults(results) {
    const resultContainer = document.getElementById('search-results');
    resultContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        results.forEach(row => {
            // Assuming Column C (index 2) is the title
            const cardTitle = row[2]; // Column C is the title
            const cardSubtitle = row[3]; // Column D is the subtitle
            const cardBodyContent = row.slice(4).map(item => item).join('<br>'); // // Join all other column values with line breaks

            const cardHTML = `
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                            <div class="card" style="width: 100%;">
                                <div class="card-body">
                                    <h5 class="card-title">${cardTitle}</h5> <!-- Column C as title -->
                                    <h6 class="card-subtitle mb-2 text-muted">${cardSubtitle}</h6> <!-- Column D as subtitle -->
                                    <p class="card-text">${cardBodyContent}</p> <!-- Column E onwards as body with line breaks -->
                                    <div class="card-footer text-end">
                                        <a href="#" class="card-link">Gambar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            resultContainer.innerHTML += cardHTML; // Add card to container
        });
    } else {
        resultContainer.innerHTML = '<div class="col-12"><p class="text-center">No results found.</p></div>';
    }
}
