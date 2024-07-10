const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  port: "3305",
  user: "user",
  password: "password",
  database: "activity_forecast",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    throw err;
  }
  console.log("MySQL connected...");
});

// Function to get room names
function getRoomNames(callback) {
  const query = "SELECT name FROM room";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching room names:", err);
      return callback(err, null);
    }

    const roomNames = results.map((row) => row.name);
    console.log("Fetched room names:", roomNames); // Log the room names
    callback(null, roomNames);
  });
}

// Endpoint to get room names
app.get("/api/roomNames", (req, res) => {
  getRoomNames((err, roomNames) => {
    if (err) {
      console.error("Error fetching room names:", err);
      return res.status(500).json({ error: "Failed to fetch room names" });
    }
    res.json({ roomNames });
  });
});

// Endpoint to get batchId by roomName
app.get("/api/batchId/:roomName", (req, res) => {
  const roomName = req.params.roomName;
  const query = "SELECT batchId FROM batches WHERE roomName = ?";

  db.query(query, [roomName], (err, results) => {
    if (err) {
      console.error("Error fetching batchId:", err);
      return res.status(500).json({ error: "Failed to fetch batchId" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "BatchId not found for roomName" });
    }
    const batchId = results[0].batchId;
    res.json({ batchId });
  });
});

// Endpoint to save schedule
app.post("/api/schedule", (req, res) => {
  const { roomName, batchId } = req.body;
  const sql = "INSERT INTO schedules (roomName, batchId) VALUES (?, ?)";

  db.query(sql, [roomName, batchId], (err, result) => {
    if (err) {
      res.status(500).send("Failed to save data");
    } else {
      res.status(200).send("Data saved successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
