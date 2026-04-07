const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'alerts.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // For development: Drops table if it exists to ensure schema update
        // WARNING: This deletes all data on server restart. Comment out if persistence needed.
        // db.run(`DROP TABLE IF EXISTS alerts`, () => {
        db.run(`CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                Adhaar_card_details TEXT,
                latitude REAL,
                longitude REAL,
                image_base64 TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            }
        });
        // });
    }
});

module.exports = db;
