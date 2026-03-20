const entriesContainer = document.getElementById('entries-container');

async function fetchEntries() {
    try {
        const response = await fetch('/entries'); // Fetch data from the backend
        const entries = await response.json();   // Parse JSON response
        
        // Clear existing entries
        entriesContainer.innerHTML = '';

        // Populate entries dynamically into HTML
        entries.forEach(entry => {
            const article = document.createElement('article');
            article.classList.add('journal-entry');
            
            const heading = document.createElement('h3');
            heading.innerHTML = `${entry.user} <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>`;
            
            const content = document.createElement('p');
            content.textContent = entry.text;

            article.appendChild(heading);
            article.appendChild(content);

            entriesContainer.appendChild(article);
        });
    } catch (error) {
        console.error('Error fetching entries:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to load entries. Please try again later.';
        entriesContainer.appendChild(errorMessage);
    }
}

fetchEntries();