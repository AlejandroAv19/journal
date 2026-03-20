const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.use(bodyParser.json());

app.use(express.static('public'));

const CONNECTION_URL = 'mongodb://localhost:27017/journal';
mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB successfully.');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

/* A schema defines the structure and rules for storing documents in the collection.
    Think of it as a "blueprint" for the data.
    Each document in the collection must conform to this schema. */
const journalSchema = new mongoose.Schema({
    user: String,
    text: String,
    date: { type: Date, default: Date.now },
});

/* A model is a representation of the MongoDB collection and provides methods to interact with it (e.g., queries, inserting documents)
    Models are how you interact with collections in MongoDB—they abstract away the raw database operations with an easier-to-use JavaScript API */
const entriesModel = mongoose.model('entries', journalSchema);

app.get('/entries', async (req, res) => {
    try {
        const data = await entriesModel.find();
        console.log('Retrieved entries:', data);
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch entries:', error.message);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})