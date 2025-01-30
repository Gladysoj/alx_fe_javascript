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

    
    window.exportToJson = function() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'quotes.json';
        link.click();
        URL.revokeObjectURL(url); 
    };

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

    
    window.importFromJsonFile = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                try {
                    const importedQuotes = JSON.parse(content);
                    if (Array.isArray(importedQuotes)) {
                        quotes = quotes.concat(importedQuotes); 
                        saveQuotes(); 
                        alert('Quotes imported successfully!');
                        showRandomQuote(); 
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

    
    createAddQuoteForm();  
    showRandomQuote();     

    
    newQuoteButton.addEventListener('click', showRandomQuote);
});