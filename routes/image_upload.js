var express = require('express');
var router = express.Router();
const Clarifai = require('clarifai');
var fs = require('fs');
const TokenStore = require('./token-store.js');

const app = new Clarifai.App({
    apiKey: 'f311839ebcc242d5b3d1c411fd75a27b'
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

            var stream = fs.createReadStream('./public/images/'+req.query.img);
            var folderID = "0";
            var token = TokenStore.read(function (cb) {
                if(cb){
                    console.log(cb);
                }
            })
            const client = sdk.getBasicClient(token.accessToken);
            client.files.uploadFile(folderID,req.query.img , stream)
                .then(file => {
                    onsole.log(util.inspect(file, false, null));
                }).catch(function (err) {
                console.log(util.inspect(err.response.body, false, null));
            });
            res.send(tagArray);
            //res.render('index',{file:"./images/"+req.query.img});
            //res.send("output",{tags:tagArray,img:"./images/"+req.query.img});
            //res.status({tags:tagArray,img:"./images/"+req.query.img}).send('output');

        },
        function(err) {
            console.error(err);
        }
    );
})



module.exports = router;