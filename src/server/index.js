const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const api = require('./api');
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use 'dist' for static path
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api', api);

// Send index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Save port 
const port = process.env.PORT || '3000';
app.set('port', port);

// Start server
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on port ${port}`));