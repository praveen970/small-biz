// Initialize packages
var express = require('express');
var router = express.Router(); // Express
const appConfig = require('./boxConfig.js');       // Auth keys and Box SDK
const boxSDK = appConfig.boxSDK;                // Box SDK
const bodyParser = require('body-parser');      // Allow JSON and URL encoded HTTP responses
const http = require('http');                   // HTTP for Express server
const querystring = require('querystring');     // Querystring stringifier


// Create a new Box SDK instance
const sdk = new boxSDK({
    clientID: appConfig.oauthClientId,
    clientSecret: appConfig.oauthClientSecret
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function(req, res) {
    // Build Box auth object
    const payload = {
        'response_type': 'code',
        'client_id': appConfig.oauthClientId,
        'redirect_uri': appConfig.redirectURI
    };

    // Build redirect URI and redirect
    const qs = querystring.stringify(payload);
    const authEndpoint = `https://account.box.com/api/oauth2/authorize?${qs}`;
    res.redirect(authEndpoint);
});



// Create Express server


module.exports = router;