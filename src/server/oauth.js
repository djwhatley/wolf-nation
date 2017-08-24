const jwt = require('express-jwt');
const jwtlib = require('jwt-simple');
const request = require('request');
const express = require('express');
const router = express.Router();

const db = require('./db');

router.get('/oauth2login', (req, res) => {
    if (req.query.code) {
        let code = req.query.code;

        let url = 'https://www.googleapis.com/oauth2/v4/token';

        request.post(url, {
            form: {
                client_id: process.env.OAUTH_ID,
                client_secret: process.env.OAUTH_SECRET,
                redirect_uri: process.env.OAUTH_REDIRECT_URL,
                grant_type: 'authorization_code',
                code: code      
            }
        }, (error, response, body) => {
            let data = (body && body.length) ? JSON.parse(body) : void 0;
            let frag = '#login_success=';
            if (error || !data) {
                frag += '0';
                res.redirect(process.env.APP_HOST + '/login' + frag);
                return;
            }
            else if (data['error']) {
                frag += '0';
                frag += '&error=' + data['error'];
                frag += '&error_description=' + data['error_description'];
                res.redirect(process.env.APP_HOST + '/login' + frag);
                return;
            }
            else {
                getUserInfo(data['access_token'], (err, info) => {
                    if (err || !data) {
                        frag += '0';
                        res.redirect(process.env.APP_HOST + '/login' + frag);
                        return;
                    }
                    else if (info['error']) {
                        frag += '0';
                        frag += '&error=' + info['error'];
                        frag += '&error_description=' + info['error_description'];
                        res.redirect(process.env.APP_HOST + '/login' + frag);
                        return;
                    }
                    else {
                        let email;
                        for (let e of info.emails) {
                            if (e.type == 'account')
                                email = e.value;
                        }

                        if (!email) {
                            frag += '0';
                            frag += '&error=500';
                            frag += '&error_description=' + 'Serious Error: Could not retrieve user profile info; user will need to revoke access to get a refresh token.'
                            res.redirect(process.env.APP_HOST + '/login' + frag);
                            return;
                        }

                        let exp = new Date((Date.now() / 1000) + parseInt(data['expires_in']));
                        let payload = {
                            google_token: data['access_token'],
                            gt_expires: exp.getTime(),
                            email: email
                        }

                        let token = jwtlib.encode(payload, process.env.JWT_SECRET);

                        db.connect((err, conn) => {
                            if (err)
                                res.status(500).send(err);
                            else {
                                var users = conn.collection('users');
                                users.findOne({ email: email }, (err, user) => {
                                    if (!user) {
                                        users.insertOne({
                                            email: email,
                                            refresh_token: data['refresh_token']
                                        }, (err, result) => {
                                            if (err || !result || !result.insertedCount) {
                                                frag += '0';
                                                frag += '&error_description=' + 'Serious Error: Something bad happened between logging in and creating the user; user will need to revoke access to get a refresh token.';
                                            }
                                            else {
                                                frag += '1';
                                                frag += '&token=' + token;
                                            }
                                            res.redirect(process.env.APP_HOST + '/login' + frag);
                                        });
                                    }
                                    else {
                                        frag += '1';
                                        frag += '&token=' + token;
                                        res.redirect(process.env.APP_HOST + '/login' + frag);
                                    }
                                });
                            }
                        })
                    }
                });
            }
        })
    }
    else {
        res.status(400).send('Bad Request: Required query parameter "code" (authorization code) is missing.');
    }    
});

router.get('/newtoken', jwt({ secret: process.env.JWT_SECRET }), (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    db.connect((err, conn) => {
        if (err)
            res.status(500).send(err);
        else {
            var users = conn.collection('users');
            users.findOne({ email: req.user.email }, (err, user) => {
                let refresh_token = user.refresh_token;

                let url = 'https://www.googleapis.com/oauth2/v4/token';

                request.post(url, {
                    form: {
                        client_id: process.env.OAUTH_ID,
                        client_secret: process.env.OAUTH_SECRET,
                        refresh_token: refresh_token,
                        grant_type: 'refresh_token',
                    }
                }, (error, response, body) => {
                    let data = (body && body.length) ? JSON.parse(body) : void 0;
                    if (error || !data) {
                        res.status(500).send('Internal Server Error.');
                    }
                    else if (data.error) {
                        res.status(500).send((data.error_description || 'Internal Server Error') + ': ' + data.error);
                    }
                    else {
                        let exp = new Date((Date.now() / 1000) + parseInt(data['expires_in']));
                        let payload = {
                            google_token: data['access_token'],
                            gt_expires: exp.getTime(),
                            email: user.email
                        }

                        let token = jwtlib.encode(payload, process.env.JWT_SECRET);

                        res.status(200).send(token);
                    }
                })
            });
        }
    })

})

var getUserInfo = function (access_token, callback) {
    let url = 'https://www.googleapis.com/plus/v1/people/me';

    request({
        method: 'get',
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        }    
    }, (err, res, body) => {
        console.log(res.statusCode, ' ' + res.statusMessage);
        let data = (body && body.length) ? JSON.parse(body) : void 0;
        callback(err, data);
    });  
};

module.exports = router;