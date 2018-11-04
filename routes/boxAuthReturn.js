var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
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
                res.send(currentUser);
            });
        });

        const client = sdk.getBasicClient(tokenInfo.accessToken);
        client.users.get(client.CURRENT_USER_ID, null, function(err, currentUser) {
          if(err) throw err;
          res.send('Hello, ' + currentUser.name + '!');
        });
    });
});

module.exports = router;