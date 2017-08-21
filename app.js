/*eslint-env node*/
//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
//***** FROM PACKAGE.JSON
var path = require('path');
global.appRoot = path.resolve(__dirname) + '/';
var express = require('express');
var app = express();
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var fs = require("fs");
var bodyParser = require('body-parser');
var watson = require('watson-developer-cloud');
var QRCode = require('qrcode');

//***** FROM OUR FILES
var mymsg = require('./routes/mymessage.js');
var home = require('./routes/homeRoute.js');
var base64img = require('./routes/watson/visualRecognition/base64image.js');
var qrRoute = require('./routes/qrRoute.js');
var cameraAPI = require('./routes/cameraAPI.js');
var conversationRoutes = require(appRoot + 'routes/watson/watsonConversationRoutes.js').router;
var slackRoutes = require(appRoot + 'routes/watson/watsonConversationRoutes.js').slackRouter;
var watsonIotFunc = require(appRoot + "functions/watsonIotFunctions.js");
var objectStorageFunc = require(appRoot + "functions/objectStorageFunctions.js");
//var parse64img = require('./routes/parse64image.js');
//var imgclassify = require('imageClassify.js');
//var classifyImage = require('classifyImage');
//var cookieParser = require('cookie-parser');
// var multer = require('multer'); // v1.0.5
// var upload = multer(); // for parsing multipart/form-data
//app.use(cookieParser());
// Bootstrap application settings
//require('./config/express')(app);



// serve the files out of ./public as our main files
// get the app environment from Cloud Foundry
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));


function allowCrossDomain(req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
}






//fs.readFile('./resources/qrImages/qrimage.png', 'binary', function (err, original_data) {
//var datastorage = require("image_orig.jpg");
//objectStorageFunc.objectStorage_addImage('faces_images','apple.jpeg',"./appleImage.jpeg",function(){console.log("DONE OBJECT STORAGE");});
// var Cloudant = require('cloudant');

// var imageFunc = require(appRoot + "functions/ImageFunctions.js");
// imageFunc.cropImage(appRoot + "appleImage.jpeg", appRoot + 'cropedapple.jpeg', 1000, 604, 1000, 1000, function (image) {
//     console.log(image.write(appRoot+"imagiiko.jpg"));
//  });




//watsonIotFunc.watsonIotPlatform_Connect(function () { });                //CONNECT TO IOT

//console.log(img);


var os = require('os');
var uuid = require('uuid');


// var Base64Decode = require('base64-stream').decode;
// var base64Data = new Base64Decode(img);
// console.log(base64Data.transformState.afterTransform());


var img = require("./image64.js");
var resource = parseBase64Image(img);
var temp = path.join(os.tmpdir(), uuid.v1() + '.' + resource.type);
fs.writeFileSync(temp, resource.data);
images_file = fs.createReadStream(temp);
//params.images_file = images_file;

var croppedTemp = path.join(os.tmpdir(), uuid.v1() + '.' + "jpeg");



function parseBase64Image(imageString) {
    var matches = imageString.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    var resource = {};

    if (matches.length !== 3) {
        return null;
    }
    resource.type = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    resource.data = new Buffer(matches[2], 'base64');
    return resource;
}

var imageFunc = require(appRoot + "functions/ImageFunctions.js");


imageFunc.cropImage(temp, croppedTemp, 50, 100, 400, 200, function () { });


// var Jimp = require("jimp");
// var b64string = img;
// var base64Data = img.replace(/^data:image\/jpeg;base64,/, "");

// var buf = new Buffer(b64string, 'base64'); // Ta-da


// Jimp.read(, function (err, image) {
//     // do stuff with the image (if no exception) 
//     image.write(appRoot + "frame1.jpg");
// });



// var b64string = img;
// var base64Data = img.replace(/^data:image\/jpeg;base64,/, "");

// var buf = new Buffer(b64string, 'base64'); // Ta-da
// //buf = buf.toString();

// var Base64Decode = require('base64-stream').decode;
// var stringImage = img;
// var buf = new Base64Decode(stringImage);

// console.log(buf);
// var watson = require('watson-developer-cloud');

// var visual_recognition = watson.visual_recognition({
//     api_key: '85994b46554e429e98772c66206de8dd54759076',
//     version: 'v3',
//     version_date: '2016-05-20'
// });
// var params = {
//     url: null,
//     images_file: buf
// };
// var resource = parseBase64Image(img);
// var temp = path.join(os.tmpdir(), uuid.v1() + '.' + resource.type);
// fs.writeFileSync(temp, resource.data);
// params.images_file = fs.createReadStream(temp);

// visual_recognition.classify(params, function (err, objectsDetected) {
//     if (err) {
//         console.log("Watson Erros is " + err);
//     }
//     else {
//         console.log(JSON.stringify(objectsDetected, null, 2));
//     }

// });







fs.readFile('./resources/qrImages/qrimage.png', 'binary', function (err, original_data) {
    //console.log(original_data);
    //original_data.

});










 //var cloudantFunc = require(appRoot + "functions/cloudantFunctions.js");

//  var event = {
//             "frameId": "a489ec71e93e96f5736532a06a2d7386",
//             "frameTitle": "Salma 5.jpg",
//             "cameraId": "double-vision-cam",
//             "frameTime": "1484031591205",
//             "visualRecognitionClasses": "ObjectsDetected",
//             "faceIdentificationClass": "facesDetected"
//         }
//         cloudantFunc.insertDoc("hoss_db", event);

        




var twilioFunc = require(appRoot + "functions/twilioFunctions.js");
app.post('/newCameraSms', function (req, res) {
    twilioFunc.sendNewCameraSms();
    res.send("SMS IS SENT");
});





app.get('/sendimage',function(req,res){
    //res.send("hosshoss");
    res.sendFile(appRoot+'appleImage.jpeg');

});



//APP.USE
//app.use('/', allowCrossDomain, home);
//app.use('/mymsg', allowCrossDomain, mymsg);
app.use('/image', base64img);
app.use('/QR', allowCrossDomain, qrRoute);            //QR CODE 
app.use('/Camera', allowCrossDomain, cameraAPI);
app.use('/conversation', allowCrossDomain, conversationRoutes);
app.use('/slack_conversation', allowCrossDomain , slackRoutes );
app.use(express.static(__dirname + '/public'));





//start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
