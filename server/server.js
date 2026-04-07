const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images

// Routes
app.post('/api/sos', (req, res) => {
    const { name, phone, latitude, longitude, image } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Location data is required' });
    }

    const sql = `INSERT INTO alerts (name, Adhaar_card_details, latitude, longitude, image_base64) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, phone, latitude, longitude, image];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error inserting alert:', err.message);
            return res.status(500).json({ error: 'Failed to save alert' });
        }
        console.log(`SOS Alert received! ID: ${this.lastID}`);

        // Send SMS via Fast2SMS
        const apiKey = 'h4LXY5YV9HzDiowPgVMD6sSybeWC81VhSndn2cQXkA06TToaNJSnIXTAAXRb';
        const message = `SOS Alert! Help needed. Name: ${name}, Phone: ${phone}, Location: https://www.google.com/maps?q=${latitude},${longitude}`;
        // const numbers = '7658885842';
        const numbers = '9779611696';

        axios.get('https://www.fast2sms.com/dev/bulkV2', {
            params: {
                authorization: apiKey,
                message: message,
                language: 'english',
                route: 'q',
                numbers: numbers
            }
        })
            .then(response => {
                console.log('SMS sent successfully:', response.data);
                res.json({ message: 'SOS Alert Sent Successfully (SMS Sent)', id: this.lastID });
            })
            .catch(error => {
                console.error('Error sending SMS:', error.message);
                // Still return success for the alert itself, even if SMS fails
                res.json({ message: 'SOS Alert Saved (SMS Failed)', id: this.lastID });
            });
    });
});

app.get('/', (req, res) => {
    res.send('Safety Portal API is running.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
