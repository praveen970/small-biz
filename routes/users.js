var express = require('express');
var router = express.Router();
const TokenStore = require('./token-store.js');
const appConfig = require('./boxConfig.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
var t = require('./index.js');
console.log(module.exports.token);
});

module.exports = router;
