const request = require('request');
const express = require('express');
const router = express.Router();

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
            }
            else if (data['error']) {
                frag += '0';
                frag += '&error=' + data['error'];
                frag += '&error_description=' + data['error_description'];
            }
            else {
                getUserInfo(data['access_token'], (err, info) => {
                    console.log(info);
/*                    let userInfo = JSON.parse(info);

                    console.log(userInfo);*/
                });

                frag += '1';
                frag += '&access_token=' + data['access_token'];
                frag += '&expires_in=' + data['expires_in'];
                frag += '&token_type=' + data['token_type'];
                frag += '&refresh_token=' + data['refresh_token'];
            }

            res.redirect(process.env.APP_HOST + '/login' + frag);
        })
    }
    else {
        // handle problems
        res.status(500).send('Error authorizing: ' + req.query.error);
    }    
});

router.get('/newtoken', (req, res) => {
    if (req.query.refresh_token) {
        let url = 'https://www.googleapis.com/oauth2/v4/token';

        request.post(url, {
            form: {
                client_id: process.env.OAUTH_ID,
                client_secret: process.env.OAUTH_SECRET,
                refresh_token: req.query.refresh_token,
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
                res.status(200).send(body);
            }
        });
    }
    else {
        res.status(400).send('Bad Request: Required query parameter "refresh_token" is missing.');
    }
});

var getUserInfo = function (access_token, callback) {
    let url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';

    request({
        method: 'get',
        url: url,
        headers: {
            'Authorization': 'Bearer ' + access_token
        }    
    }, (err, res, body) => {
        let data = (body && body.length) ? JSON.parse(body) : void 0;
        callback(err, data);
    });  
};

module.exports = router;