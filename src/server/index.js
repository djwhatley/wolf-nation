const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const moment = require('moment');
const path = require('path');

const api = require('./api');
const oauth = require('./oauth');
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.APP_HOST);
    res.header('Access-Control-Allow-Headers', 'Authorization');
    next();
});

// Logging
app.use((req, res, next) => {
    logmsg(`${req.method} ${req.url}`);
    res.on('finish', () => {
        logmsg(`${res.statusCode} ${res.statusMessage}`);
    });
    next();
});

var logmsg = function (message) {
    let s = new Date().toLocaleString()
    console.log(`[${moment().format('MM-DD-YYYY HH:mm:ss')}] ` + message);
}

// Use 'dist' for static path
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api', api);
app.use('/o', oauth);

// Send index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Save port 
const port = process.env.PORT || '3000';
app.set('port', port);

// Start server
const server = http.createServer(app);
server.listen(port, () => logmsg(`API server running on port ${port}`));