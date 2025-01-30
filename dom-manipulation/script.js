// script.js

// Sample quotes data
let quotes = [
    { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi", category: "Change" },
    { text: "Two roads diverged in a wood and I - I took the one less traveled by.", author: "Robert Frost", category: "Life" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');

// Function to display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}" - ${quote.author}</p>`;
}

// Event listener for new quote button
newQuoteButton.addEventListener('click', displayRandomQuote);

// Function to populate categories in the dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes based on category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.innerHTML = `<p>"${quote.text}" - ${quote.author}</p>`;
    } else {
        quoteDisplay.innerHTML = '<p>No quotes found in this category.</p>';
    }
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = JSON.parse(e.target.result);
                if (Array.isArray(content)) {
                    quotes = [...quotes, ...content];
                    populateCategories(); // Update categories after import
                    alert('Quotes imported successfully!');
                } else {
                    alert('Invalid file format. Please upload a JSON array of quotes.');
                }
            } catch (error) {
                alert('Error parsing JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Export quotes as JSON
function exportToJson() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add quote function (simulated server interaction)
function addQuote(quote) {
    // Simulate server interaction with a delay
    setTimeout(() => {
        quotes.push(quote);
        populateCategories();
        alert('Quote added successfully!');
    }, 1000);
}

// Function to simulate data syncing
function syncData() {
    // Simulate fetching new data from server
    setTimeout(() => {
        const newQuotes = [
            { text: "New quote from server", author: "Server", category: "Server" }
        ];
        quotes = [...quotes, ...newQuotes];
        populateCategories();
        displayRandomQuote();
        alert('Data sync completed!');
    }, 2000);
}

// Conflict resolution (simple merge strategy)
function resolveConflicts(localQuotes, serverQuotes) {
    // Here, we'll just merge new server quotes not present in local
    const localIds = new Set(localQuotes.map(q => q.text + q.author));
    const mergedQuotes = [...localQuotes];
    
    serverQuotes.forEach(serverQuote => {
        if (!localIds.has(serverQuote.text + serverQuote.author)) {
            mergedQuotes.push(serverQuote);
        }
    });
    return mergedQuotes;
}

// Initial setup
populateCategories();
displayRandomQuote();

// Expose functions for external use or testing
export { quotes, addQuote, syncData, resolveConflicts, exportToJson };