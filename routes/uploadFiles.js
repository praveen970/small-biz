var express = require('express');
var router = express.Router();
var multer = require('multer');


var uploading = multer({
    dest: __dirname + './public/images',
})



router.post(uploading, function (req, res) {
    console.log("uploaded");

});
router.get('/',function (req, res) {
    res.render('index');
})



module.exports = router;