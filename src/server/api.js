const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/', (req, res) => {
    res.status(200).send('api works');
});

router.get('/teams', (req, res) => {
    db.connect((err, conn) => {
        var teams = conn.collection('teams');
        teams.find({}).toArray((err, docs) => {
            res.status(200).json(docs);
        });
    });
});

module.exports = router;