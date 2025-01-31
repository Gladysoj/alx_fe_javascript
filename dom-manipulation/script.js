document.addEventListener('DOMContentLoaded', function() {
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');

    
    let quotes = [
        { text: "The only way to do great work is to love what you do.", category: "Motivation" },
        { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
        { text: "Be the change that you wish to see in the world.", category: "Inspiration" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
    ];

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    
    function loadQuotes() {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        }
    }

    
    loadQuotes();

    
    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    
    function showRandomQuote() {
        if (quotes.length > 0) {
            const quote = getRandomQuote();
            quoteDisplay.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
            
            sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
        } else {
            quoteDisplay.textContent = "No quotes available. Add some quotes!";
        }
    }

    
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

    
    window.addQuote = function() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            saveQuotes(); 
            showRandomQuote();
        } else {
            alert("Please fill in both the quote text and category.");
        }
    };

    
    function exportToJsonFile() {
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

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
      }

    
    

    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
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

    function importFromFile() {
        const file = importFile.files[0];
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
    

    function addQuote(quote) {
        // Simulate server interaction with a delay
        setTimeout(() => {
            quotes.push(quote);
            populateCategories();
            alert('Quote added successfully!');
            displayRandomQuote();
            postQuoteToServer(quote);
        }, 1000);
    }
    
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

    function fetchQuotesFromServer() {
        // Simulate fetching from server
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { text: "New quote from server", author: "Server", category: "Server" }
                ]);
            }, 2000);
        });
    }

    function postQuoteToServer(quote) {
        // Simulate posting to server
        console.log("Posted to server:", quote);
    }

    function syncQuotes() {
        fetchQuotesFromServer().then(serverQuotes => {
            const updatedQuotes = resolveConflicts(quotes, serverQuotes);
            if (updatedQuotes.length > quotes.length) {
                quotes = updatedQuotes;
                populateCategories();
                displayRandomQuote();
                statusMessage.innerHTML = '<p>Quotes updated from server.</p>';
            } else if (updatedQuotes.length < quotes.length) {
                statusMessage.innerHTML = '<p>Conflict resolved. Some quotes might have been removed.</p>';
            } else {
                statusMessage.innerHTML = '<p>No new quotes from server.</p>';
            }
            setTimeout(syncQuotes, 10000); // Sync every 10 seconds
        }).catch(error => {
            console.error("Error syncing quotes:", error);
            statusMessage.innerHTML = '<p>Failed to sync quotes from server.</p>';
        });
    }
    


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



    createAddQuoteForm();  
    showRandomQuote();     

    populateCategories();
    displayRandomQuote();
    syncQuotes();

    
    newQuoteButton.addEventListener('click', showRandomQuote);
});


