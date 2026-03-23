const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

const CONNECTION_URL = "mongodb://localhost:27017/journal";
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
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
    Models are how you interact with collections in MongoDB, they abstract away the raw database operations with an easier-to-use JavaScript API */
const entriesModel = mongoose.model("entries", journalSchema);

app.get("/entries", async (req, res) => {
  try {
    const data = await entriesModel.find();

    if (data.length === 0) {
      return res.status(204).send();
    }

    res.json(data);
  } catch (error) {
    console.error("Failed to fetch entries:", error.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

app.post("/entries", async (req, res) => {
  const { user, text } = req.body;

  if (!user || !text) {
    return res.status(400).json({ error: "User and text are required." });
  }

  try {
    const newEntry = new entriesModel({ user, text });
    const savedEntry = await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Entry created successfully!",
      entry: savedEntry,
    });
  } catch (error) {
    console.error("Error saving the entry:", error.message);
    res.status(500).json({ error: "Failed to save entry." });
  }
});

app.delete("/entries/:id", async (req, res) => {
  try {
    const deletedEntry = await entriesModel.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Entry not found!" });
    }

    res.json({ success: true, message: "Entry deleted!", entry: deletedEntry });
  } catch (error) {
    console.error("Failed to delete entry:", error.message);
    res.status(500).json({ error: "Failed to delete entry." });
  }
});

app.put("/entries/:id", async (req, res) => {
  try {
    const updatedEntry = await entriesModel.findOneAndUpdate(
      { _id: req.params.id },
      { text: req.body.text },
      { returnDocument: "after" },
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Entry not found!" });
    }

    res.json({ success: true, message: "Entry updated!", entry: updatedEntry });
  } catch (error) {
    console.error("Failed to update entry:", error.message);
    res.status(500).json({ error: "Failed to update entry." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
