document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');

    // Array of quote objects
    let quotes = [];

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Function to load quotes from local storage
    function loadQuotes() {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        }
    }

    // Load quotes from local storage on initialization
    loadQuotes();

    // Function to get a random quote
    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Function to display a random quote
    function showRandomQuote() {
        if (quotes.length > 0) {
            const quote = getRandomQuote();
            quoteDisplay.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
            // Store the last viewed quote in session storage
            sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
        } else {
            quoteDisplay.textContent = "No quotes available. Add some quotes!";
        }
    }

    // Function to create and add a form for adding new quotes to the DOM
    function createAddQuoteForm() {
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
            <button onclick="exportToJson()">Export Quotes</button>
            <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
        `;
        document.body.appendChild(formContainer);
    }

    // Function to add a new quote to the quotes array
    window.addQuote = function() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            saveQuotes(); // Save to local storage
            showRandomQuote(); // Display a new quote, which might now include the one just added
        } else {
            alert("Please fill in both the quote text and category.");
        }
    };

    // Function to export quotes to JSON using URL.createObjectURL
    window.exportToJson = function() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'quotes.json';
        link.click();
        URL.revokeObjectURL(url); // Clean up to save memory
    };

    // Function to import quotes from JSON file
    window.importFromJsonFile = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                try {
                    const importedQuotes = JSON.parse(content);
                    if (Array.isArray(importedQuotes)) {
                        quotes = quotes.concat(importedQuotes); // Merge new quotes with existing ones
                        saveQuotes(); // Save updated quotes to local storage
                        alert('Quotes imported successfully!');
                        showRandomQuote(); // Show a random quote from the updated list
                    } else {
                        alert('Invalid format. Please ensure the file contains an array of quotes.');
                    }
                } catch (error) {
                    alert('Error reading file: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };

    // Initial actions
    createAddQuoteForm();  // Create the form for adding new quotes
    showRandomQuote();     // Display an initial random quote

    // Event listener for showing new quotes
    newQuoteButton.addEventListener('click', showRandomQuote);
});