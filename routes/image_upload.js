var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');
var fs = require('fs');

const app = new Clarifai.App({
    apiKey: '5fdd916715f34b26ab5345b1e709c5cd'
});

router.get('/', function (req, res, next) {
    var code = req.query.code;
    console.log(code);
    var imgStr= fs.readFileSync('./public/images/'+req.query.img,'base64');
    app.models.predict(Clarifai.GENERAL_MODEL, imgStr).then(
        function(response) {
            var jsonData = JSON.parse(JSON.stringify(response));
            var conceptsArray = jsonData.outputs[0].data.concepts;
            var tagArray = [];
            for(var i=0;i<conceptsArray.length;i++){
                tagArray.push(conceptsArray[i].name);
            }
            res.render('index',{img:'./images/'+req.query.img, data:tagArray});


        },
        function(err) {
            console.error(err);
        }
    );
})



module.exports = router;