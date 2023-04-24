const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

// Instantiate the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create health check endpoint
app.get("/health", (_req, res) => {
  res.send("OK");
});

// Create a new library, get ID back
app.post("/library/create", (req, res) => {
  const newLibrary = req.body;
  fs.readFile("database.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading from database");
    }

    let database = JSON.parse(data);
    console.log(newLibrary);

    database.push(newLibrary);

    fs.writeFile("database.json", JSON.stringify(database), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error writing to database");
      }

      res.send(`New library created with ID: ${newLibrary.libraryId}`);
    });
  });
});

// Get a library by ID
app.get("/library/:libraryId", (req, res) => {
  fs.readFile("database.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading from database");
    }

    const database = JSON.parse(data);
    const filteredDatabase = database.filter(
      (library) => library.libraryId === req.params.libraryId
    );

    if (filteredDatabase.length === 0) {
      return res.status(404).send("Library not found");
    }

    res.send(filteredDatabase[0]);
  });
});

// Get all libraries by user ID
app.get("/:userId/libraries", (req, res) => {
  fs.readFile("database.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading from database");
    }

    const database = JSON.parse(data);
    const filteredDatabase = database.filter(
      (library) => library.userId === req.params.userId
    );

    res.send(filteredDatabase);
  });
});

// Start the server
app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
