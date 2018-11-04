// Initialize packages
var express = require('express');
var router = express.Router(); // Express
const appConfig = require('./boxConfig.js');       // Auth keys and Box SDK
const boxSDK = appConfig.boxSDK;                // Box SDK
const bodyParser = require('body-parser');      // Allow JSON and URL encoded HTTP responses
const http = require('http');                   // HTTP for Express server
const querystring = require('querystring');     // Querystring stringifier
const TokenStore = require('./token-store.js'); // Token storage

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

router.get('/return', function(req, res) {
    // Extract auth code and state
    const state = req.query.state;
    const code = req.query.code;

    // Exchange auth code for an access token
    sdk.getTokensAuthorizationCodeGrant(code, null, function(err, tokenInfo) {
        if (err) {
            console.error(err);
        }

        // Create new token store instance, and write to it
        var tokenStore = new TokenStore();
        tokenStore.write(tokenInfo, function(storeErr) {
            if (err) {
                console.error(err);
            }

            // Create new persistent client with token storage
            var client = sdk.getPersistentClient(tokenInfo, tokenStore);

            // Get current user information and display
            client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
                if(err) throw err;
                console.log(currentUser);
            });
        });

        /*const client = sdk.getBasicClient(tokenInfo.accessToken);
        client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
          if(err) throw err;
          console.log('Hello, ' + currentUser.name + '!');
        });*/
    });
});

// Create Express server


module.exports = router;