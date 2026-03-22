const entriesContainer = document.getElementById('entries-container');
const entryForm = document.getElementById("entry-form");
const entryTextArea = document.getElementById("entry-text");
const entryUser = document.getElementById("entry-user");
const updateForm = document.getElementById("update-form");

async function fetchEntries() {
    try {
        const response = await fetch('/entries'); 
        const entries = await response.json();
        
        // Clear existing entries
        entriesContainer.innerHTML = '';

        entries.forEach(entry => {
            // READ
            const article = document.createElement('article');
            article.classList.add('journal-entry');
            article.id = entry._id;
            
            const heading = document.createElement('h3');
            heading.innerHTML = `${entry.user} <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>`;
            
            const content = document.createElement('p');
            content.className = "entry-text";
            content.textContent = entry.text;

            // DELETE
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteEntry(entry._id);

            // UPDATE
            const showUpdateButton = document.createElement("button");
            showUpdateButton.textContent = "Update";
            showUpdateButton.onclick = () => showUpdateForm(entry._id);

            const updateForm = document.createElement("form");
            updateForm.id = "update-form";
            updateForm.hidden = true;

            const updateInput = document.createElement("textarea");
            updateInput.placeholder = "Update you entry here:"

            const confirmUpdateButton = document.createElement("button");
            confirmUpdateButton.textContent = "Confirm";
            confirmUpdateButton.type = "submit";
            confirmUpdateButton.onclick = () => updateEntry(entry._id);

            article.appendChild(heading);
            updateForm.appendChild(updateInput);
            updateForm.appendChild(confirmUpdateButton);
            article.appendChild(updateForm);
            article.appendChild(deleteButton);
            article.appendChild(showUpdateButton);
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

entriesContainer.addEventListener("submit", async (event) => {
    if (event.target.tagName === "FORM" && event.target.id === "update-form") {
        event.preventDefault();

        const entryId = event.target.parentElement.id;
        const updatedText = event.target.getElementsByTagName("textarea")[0].value;

        if (!updatedText.trim()) {
            alert("Please enter a valid updated text!");
            return;
        }

        try {
            const response = await fetch(`/entries/${entryId}`, {
                method: "PUT",
                body: JSON.stringify({ text: updatedText }),
                headers: { 
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                console.log("Entry successfully updated!");
                await fetchEntries();
            } else {
                console.error("Failed to update entry.");
                alert("Failed to update the entry. Please try again.");
            }
        } catch (error) {
            console.error("Error updating entry:", error);
            alert("There was an error updating the entry. Please try again later.");
        }
    }
});

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

async function showUpdateForm(id) {
    console.log(id);
    const entryText = document.getElementById(id).getElementsByClassName("entry-text")[0].textContent;

    if(entryText){
        const updateForm = document.getElementById(id).getElementsByTagName("form")[0];
        updateForm.hidden = false;

        const formTextArea = updateForm.getElementsByTagName("textarea")[0];
        formTextArea.innerText = entryText;
    }else{
        console.log("ERROR");
    }
}

fetchEntries();