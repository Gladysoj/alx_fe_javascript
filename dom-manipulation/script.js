document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');

    // Array of quote objects
    let quotes = [
        { text: "The only way to do great work is to love what you do.", category: "Motivation" },
        { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
        { text: "Be the change that you wish to see in the world.", category: "Inspiration" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
    ];

    // Function to get a random quote
    function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Function to display a random quote
    function showRandomQuote() {
        const quote = getRandomQuote();
        quoteDisplay.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;
    }

    // Function to create and add a form for adding new quotes to the DOM
    function createAddQuoteForm() {
        const formContainer = document.createElement('div');
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        `;
        document.body.appendChild(formContainer);
    }

    // Function to add a new quote to the quotes array
    window.addQuote = function() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            // Clear the input fields after adding
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            showRandomQuote(); // Display a new quote, which might now include the one just added
        } else {
            alert("Please fill in both the quote text and category.");
        }
    };

    // Initial actions
    createAddQuoteForm();  // Create the form for adding new quotes
    showRandomQuote();     // Display an initial random quote

    // Event listener for showing new quotes
    newQuoteButton.addEventListener('click', showRandomQuote);
});