// dbQueries.js

const mysql = require("mysql2");

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

function getRoomNames(callback) {
  const query = "SELECT name FROM room";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching room names:", err);
      return callback(err, null);
    }

    const roomNames = results.map((row) => row.roomName);
    console.log("Fetched room names:", roomNames); // Log the room names
    callback(null, roomNames);
  });
}

module.exports = {
  getRoomNames,
  db,
};
