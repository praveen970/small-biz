var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imageRouter = require('./routes/image_upload');
var boxAuth = require('./routes/boxAuth');
var returnCode = require('./routes/boxAuthReturn');
var imagesUpload = require('./routes/uploadFiles');
var app = express();
var multer  = require('multer')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const storage = multer.diskStorage({
   destination: './public/images/',
    filename: function (req, file, cb) {
        cb(null,file.fieldname+Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({
    storage:storage
}).single('image');
app.post('/images',(req,res)=>{
    upload(req, res, (err)=>{
        if(err){
            res.render('index');
        }else{
            console.log(req.file);
            //res.send('index',{'img_title':req.file.filename()});
            res.redirect('/image_upload?img='+req.file.filename);
        }
    })
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/image_upload',imageRouter);
app.use('/auth',boxAuth);
app.use('/return', returnCode);
// app.use('/images', imagesUpload);
module.exports = app;
