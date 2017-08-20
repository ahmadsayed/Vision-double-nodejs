var express = require('express');
var router = express.Router();
var fs = require("fs");
var multer = require('multer');          // v1.0.5
var upload = multer();                   // for parsing multipart/form-data
var QRCode = require('qrcode');
var base64Img = require('base64-img');
//var base64_encode = require('../functions/base64Encoding.js');
var qrdata;
var watsonIotFunc = require(appRoot + "functions/watsonIotFunctions.js");


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
router.post('/qrgenerate', upload.array(), function (req, res, next) {
    // Some data processing 
    /*  BY PRIORITY
        - Iot credentials       (AUTOMATED)     FROM CF ENV VARIABLES - IOT CREDENTIAL
        - Network               ()
        - Camera Settings       ()
    */
    qrdata = {
        organization: "l3kk7q",
        deviceType: "Double-Vision-Pi",
        deviceId: "000c29cbd633",
        authToken: "K25k+ue!&1bd49Xq(d",
        resturl: "http://double-vision-hossam.mybluemix.net/image"
    };
    //Generating QR CODE && SAVING THE IMAGE SOMEWHERE
    QRCode.toFile('qrimage.png', JSON.stringify(qrdata), {
        color: {
            dark: '#000',  // Blue dots
            light: '#FFF' // Transparent background
        }
    }, function (err) {
        if (err) throw err
        console.log('done')
    });
    console.log(__dirname);



    //TODO ... MAKE GENERIC BASE64 ENCODER AND DECODER FUNCTIONS .. 
    fs.readFile('./resources/qrImages/qrimage.png', 'binary', function (err, original_data) {
        type = "image/png";
        var prefix = "data:" + type + ";base64,";
        //fs.writeFile('image_orig.jpg', original_data, 'binary', function (err) { });
        var base64Image = new Buffer(original_data, 'binary').toString('base64');
        res.send(prefix + base64Image);
        //console.log("base64 QR is " + prefix + base64Image);
        //var decodedImage = new Buffer(base64Image, 'base64').toString('binary');
        //fs.writeFile('image_decoded.png', decodedImage, 'binary', function (err) { });
    });

});



router.post('/qrRegister', upload.array(), function (req, res, next) {

    // var IBMIoTF = require('ibmiotf');

    // var appClientConfig = {     //WE GET FROM IOT PLATFORM SETTINGS --> LATER FROM ENV. 
    //     org: 'hossam_IOT_organization',           //organization ID
    //     id: 'c7tg7s',
    //     "auth-key": 'a-c7tg7s-wpk1qtvb8l',
    //     "auth-token": 'QHkaU2xj4mGG9m8T1O'
    // };
    // var appClient = new IBMIoTF.IotfApplication(appClientConfig);

    // var iotf = require("ibmiotf");
    // var config = {
    //     org: "l3kk7q",
    //     id: "000c29cbd633",
    //     type: "Double-Vision-PI",
    //     "auth-method": "token",
    //     "auth-token": "K25k+ue!&1bd49Xq(d"          //FOR THE PLATFORM
    // };
    // var config = {     //WE GET FROM IOT PLATFORM SETTINGS --> LATER FROM ENV. 
    //     org: 'c7tg7s',           //organization ID
    //     id: 'myapp',
    //     type: 'hossam-type',
    //     "auth-key": 'a-c7tg7s-vxdizrmmsi',
    //     "auth-method": 'token',
    //     "auth-token": 'fJ&-Lix-TDm4z@ZJS@'
    // };



    var new1 = require(appRoot + "classes/objectsExamples/iotNewDeviceExample.json");
    watsonIotFunc.watsonIotPlatform_addNewDevice(new1, function (err, res) {
        if (err)
            console.log("QR REGISTER ERROR IS " + JSON.stringify(err));
        else
            console.log(JSON.stringify(res, null, 2));
    });

    // var deviceClient = new iotf.IotfDevice(config);
    // deviceClient.log.setLevel('trace');
    // deviceClient.connect();

    // deviceClient.on('connect', function () {
    //     var i = 0;
    //     console.log("connected");
    //     setInterval(function function_name() {
    //         i++;
    //         deviceClient.publish('myevt', 'json', '{"value":' + i + '}', 2);
    //     }, 2000);
    // });

    res.send("ALRIGHT HEHE");
});

module.exports = router;