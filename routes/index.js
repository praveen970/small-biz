var express = require('express');
var router = express.Router();
const TokenStore = require('./token-store.js');
const appConfig = require('./boxConfig.js');
/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index');

});

module.exports = router;
