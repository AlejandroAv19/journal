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

// schema
const journalSchema = new mongoose.Schema({
    user: String,
    text: String,
    date: { type: Date, default: Date.now },
});

// model
const entries = mongoose.model('entries', journalSchema);

app.get('/entries', async (req, res) => {
    try {
        const entries = await entries.find();
        console.log('Retrieved entries:', entries);
        res.json(entries); // Send entries to the client
    } catch (error) {
        console.error('Failed to fetch entries:', error.message);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})