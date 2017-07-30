const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const http = require('http');
const morgan = require('morgan');
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
//app.use(morgan('[:date[clf]] :method :url HTTP/:http-version - :status - :res[content-length] :response-time ms'));
app.use(morgan('common'));

// Use 'dist' for static path
app.use(express.static(path.join(__dirname, '../../dist')));

// API routes
app.use('/api', api);
app.use('/o', oauth);

// Send index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Save port 
const port = process.env.PORT || '3000';
app.set('port', port);


// Start server
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));