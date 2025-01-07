document.getElementById('load-sheet').addEventListener('click', function () {
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
    const sheetId = sheetUrl.includes('docs.google.com/spreadsheets/d/')
        ? sheetUrl.split('/d/')[1].split('/')[0]
        : sheetUrl;

    if (!sheetId) {
        document.getElementById('loading').style.display = 'none';
        errorMessageElement.textContent = 'Invalid Google Sheets URL or ID.';
        return;
    }

    // Fetch data from the backend
    fetch(`http://localhost:3000/fetch-sheet?sheetId=${sheetId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';

            if (data && data.data) {
                displaySearchBar(data.data);
            } else {
                errorMessageElement.textContent = 'No data found in the sheet.';
            }
        })
        .catch(error => {
            document.getElementById('loading').style.display = 'none';
            errorMessageElement.textContent = 'Error loading the sheet. Please try again.';
            console.error('Error fetching data:', error);
        });
});

function displaySearchBar(sheetData) {
    window.sheetData = sheetData; // Store data for searching
    document.getElementById('search-container').style.display = 'flex';

    document.getElementById('search-bar').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const filteredData = window.sheetData.filter(row => {
            return row.some(cell => cell.toLowerCase().includes(query));
        });
        displaySearchResults(filteredData);
    });
}

function displaySearchResults(results) {
    const resultContainer = document.getElementById('search-results');
    resultContainer.innerHTML = '';

    if (results.length > 0) {
        results.forEach(row => {
            const cardTitle = row[2] || 'Untitled'; // Column C
            const cardSubtitle = row[3] || ''; // Column D
            const cardBodyContent = row.slice(4, 7).join('<br>'); // Columns E to G
            const cardLink = row[7] || '#'; // Column H

            const cardHTML = `
                <div class="col mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${cardTitle}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${cardSubtitle}</h6>
                            <p class="card-text">${cardBodyContent}</p>
                            <div class="card-footer text-end">
                                <a href="${cardLink}" target="_blank" class="card-link">Gambar</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            resultContainer.innerHTML += cardHTML;
        });
    } else {
        resultContainer.innerHTML = '<div class="col-12"><p class="text-center">No results found.</p></div>';
    }
}
