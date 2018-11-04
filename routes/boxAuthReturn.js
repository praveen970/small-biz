var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    var code = req.query.code;
    console.log(code);
    res.send(code);
})

module.exports = router;