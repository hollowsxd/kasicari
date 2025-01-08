document.getElementById('load-sheet').addEventListener('click', async function () {
    const sheetUrl = document.getElementById('sheet-url').value.trim();
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = ''; // Clear previous error message

    if (!sheetUrl) {
        errorMessageElement.textContent = 'Please enter a valid Google Sheets URL or ID.';
        return;
    }

    document.getElementById('loading').style.display = 'block'; // Show loading message

    const sheetId = sheetUrl.includes('docs.google.com/spreadsheets/d/')
        ? sheetUrl.split('/d/')[1].split('/')[0]
        : sheetUrl;

    if (!sheetId) {
        document.getElementById('loading').style.display = 'none';
        errorMessageElement.textContent = 'Invalid Google Sheets URL or ID.';
        return;
    }

    try {
        const response = await fetch(`/api/fetch-sheet?sheetId=${sheetId}`);
        const result = await response.json();

        if (response.ok && result.data) {
            document.getElementById('loading').style.display = 'none';
            displaySearchBar(result.data);
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        errorMessageElement.textContent = 'Error loading the sheet. Please try again.';
    }
});

function displaySearchBar(sheetData) {
    if (!Array.isArray(sheetData) || sheetData.length === 0) {
        return;
    }

    window.sheetData = sheetData;

    document.getElementById('search-container').style.display = 'flex';

    document.getElementById('search-bar').addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const filteredData = window.sheetData.filter((row) =>
            row.some((cell) => cell.toLowerCase().includes(query))
        );
        displaySearchResults(filteredData);
    });

    displaySearchResults(sheetData);
}

function displaySearchResults(results) {
    const resultContainer = document.getElementById('search-results');
    resultContainer.innerHTML = ''; // Clear previous results

    if (results.length > 0) {
        results.forEach((row) => {
            const cardTitle = row[2] || 'No Title'; // Column C as the title
            const cardSubtitle = row[3] || ''; // Column D as the subtitle
            const cardBodyContent = row.slice(4, 7).map((item) => item || '').join('<br>'); // Columns E to G
            const cardLink = row[7]; // Column H as the link

            const cardLinkHTML = cardLink
                ? `<a href="${cardLink}" target="_blank" class="card-link">Link</a>`
                : '';

            const cardHTML = `
                <div class="col mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${cardTitle}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${cardSubtitle}</h6>
                            <p class="card-text">${cardBodyContent}</p>
                            <div class="card-footer text-end">
                                ${cardLinkHTML}
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
