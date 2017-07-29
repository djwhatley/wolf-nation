const request = require('request');
const express = require('express');
const router = express.Router();

const db = require('./db');

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

const SHEET_LCR_TABS = {
    'lower': 'House Vote Count',
    'upper': 'Senate Vote Count'
};

const SHEET_VOLUNTEERS_TABS = [
    "Dylan's Volunteers",
    "Heidi's Volunteers",
    "Vaughn's Volunteers"
];

router.get('/', (req, res) => {
    res.status(200).send('api works');
});

router.get('/teams', (req, res) => {
    db.connect((err, conn) => {
        if (err)
            res.status(500).send(err);
        else {
            var teams = conn.collection('teams');
            teams.find({}).toArray((err, docs) => {
                res.status(200).json(docs);
            });
        }
    });
});

router.get('/:state', (req, res) => {
    db.connect((err, conn) => {
        if (err)
            res.status(500).send(err);
        else {
            var teams = conn.collection('teams');
            teams.findOne({ id: req.params.id }, (err, team) => {
                if (err)
                    res.status(500).send(err);
                else {
                    if (team)
                        res.status(200).json(team);
                    else
                        res.status(404).send('Not Found');
                }
            });
        }
    });
});

router.get('/:state/legislators', (req, res) => {
    let authorization = req.headers['authorization'];

    db.connect((err, conn) => {
        if (err)
            res.status(500).send(err);
        else {
            var teams = conn.collection('teams');
            teams.findOne({ id: req.params.state }, (err, team) => {
                if (err)
                    res.status(500).send(err);
                else {
                    if (team) {
                        let sheet = team.docs.lcr;
                        let legislators = [];

                        let houses = [], tabcount = 0;
                        if (req.query.house) {
                            houses.push(req.query.house);
                        } else {
                            houses = ['lower', 'upper'];
                        }

                        for (let house of houses) {
                            request({
                                method: 'get',
                                url: SHEETS_API_URL + sheet + '/values/' + SHEET_LCR_TABS[house] + '!A4:G',
                                headers: {
                                    'Authorization': authorization
                                }
                            }, (err, response, body) => {
                                let data = JSON.parse(body);

                                for (let row of data.values) {
                                    let email = row[6];
                                    let match = /([a-zA-Z]+)\.([a-zA-Z]+)@.*/.exec(email);

                                    legislators.push({
                                        state: req.params.state,
                                        chamber: house,
                                        district: Number.parseInt(row[0]),
                                        full_name: row[1],
                                        party: row[2],
                                        role: row[3],
                                        score: row[4] ? Number.parseInt(row[4]) : 0,
                                        first_name: match ? match[1][0].toUpperCase() + match[1].substring(1, match[1].length) : '',
                                        last_name: match ? match[2][0].toUpperCase() + match[2].substring(1, match[2].length) : '',
                                    });
                                }

                                tabcount++;
                                if (tabcount == houses.length) {
                                    res.status(200).json(legislators);
                                }
                            });
                        }
                    }
                    else
                        res.status(404).send('Not Found');
                }
            });
        }
    })
});

router.get('/:state/volunteers', (req, res) => {
    let authorization = req.headers['authorization'];
    
    db.connect((err, conn) => {
        if (err)
            res.status(500).send(err);
        else {
            var teams = conn.collection('teams');
            teams.findOne({ id: req.params.state }, (err, team) => {
                if (err)
                    res.status(500).send(err);
                else {
                    if (team) {
                        let sheet = team.docs.volunteers;
                        let volunteers = [];

                        let tabcount = 0;
                        for (let tab of SHEET_VOLUNTEERS_TABS) {
                            let url = SHEETS_API_URL + sheet + '/values/' + '!A4:J';

                            request({
                                method: 'get',
                                url: url,
                                headers: {
                                    'Authorization': authorization
                                }
                            }, (error, response, body) => {

                                if (error) {
                                    console.error(error);
                                    res.status(500).send(error)
                                    return;
                                }
                                
                                let data = JSON.parse(body);

                                for (let row of data.values) {
                                    let volunteer = { };

                                    volunteer.name = row[0];
                                    volunteer.phone = row[1];
                                    volunteer.email = row[2];

                                    if (volunteer.name == 'DORMANT WOLF')
                                        break;

                                    /*let oa = row[3];
                                    let lc = row[4]
                                    let lr = row[5];

                                    /*if (oa && lc && lr) {
                                    volunteer.outreach.attempts = parseInt(oa);
                                    }*/

                                    //let level = row[6];

                                    volunteer.districts = { };
                                    let regex = /[^0-9]*([0-9]+)[^0-9]*/;

                                    if (row[7]) {
                                        let match_hd = regex.exec(row[7]);
                                        let hd = (match_hd && match_hd[1]) ? parseInt(match_hd[1]) : void 0;
                                        
                                        volunteer.districts.lower = hd;
                                    }
                                    if (row[8]) {
                                        let match_ud = regex.exec(row[8])
                                        let ud = (match_ud && match_ud[1]) ? parseInt(match_ud[1]) : void 0;

                                        volunteer.districts.upper = ud;
                                    }

                                    volunteers.push(volunteer);   
                                }

                                tabcount++;
                                if (tabcount == SHEET_VOLUNTEERS_TABS.length) {
                                    res.status(200).json(volunteers);
                                }

                            })
                        }
                    }
                    else
                        res.status(404).send('Not Found');
                }
            });


           
        }
    })
});

module.exports = router;