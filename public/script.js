const entriesContainer = document.getElementById('entries-container');
const entryForm = document.getElementById("entry-form");
const entryTextArea = document.getElementById("entry-text");
const entryUser = document.getElementById("entry-user");

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

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteEntry(entry._id);

            article.appendChild(deleteButton);
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

entryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Getting data from HTML form
    const text = entryTextArea.value;
    const user = entryUser.value;

    // Making sure there are no empty spaces on either input
    if(!user.trim()){
        alert("Please provide a name");
        return;
    }

    if(!text.trim()){
        alert("Please provide text to the entry");
        return;
    }

    try{
        // Making POST request
        const response = await fetch("/entries", {
            method: "POST",
            body : JSON.stringify({user, text}),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.ok) {
            console.log("Post successfully created!");
            entryTextArea.value = "";
            await fetchEntries();
        } else {
            console.error("Failed to create post.");
            alert("There was an error creating your post. Please try again.");
        }
    }catch(error){
        console.error("Error submitting form:", error);
        alert("Unable to publish your entry at the moment. Please try again later.");
    }
})

async function deleteEntry(id) {
    const shouldDelete = confirm("Are you sure you want to delete this entry?");
    if (!shouldDelete) return;

    try {
        const response = await fetch(`/entries/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("Entry successfully deleted.");
            await fetchEntries();
        } else {
            console.error("Failed to delete entry.");
            alert("Unable to delete the entry. Please try again later.");
        }
    } catch (error) {
        console.error("Error deleting entry:", error);
        alert("Unable to delete the entry. Please try again later.");
    }
}

fetchEntries();