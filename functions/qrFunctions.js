var QRCode = require('qrcode');
var base64Img = require('base64-img');
var fs = require("fs");
var multer = require('multer');          // v1.0.5
var upload = multer();                   // for parsing multipart/form-data
//var base64_encode = require('../functions/base64Encoding.js');
var qrdata;
var path = require('path');
var os = require('os');
var uuid = require('uuid');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}



var qrGenerate = function (callback) {
    var qrdata = {
        organization: "l3kk7q",
        deviceType: "Double-Vision-Pi",
        deviceId: "000c29cbd633",
        authToken: "K25k+ue!&1bd49Xq(d",
        resturl: "http://double-vision-hossam.mybluemix.net/image"
    };
    var QRtemp = path.join(os.tmpdir(), uuid.v1() + '.' + 'png');

    //Generating QR CODE && SAVING THE IMAGE SOMEWHERE
    QRCode.toFile(QRtemp, JSON.stringify(qrdata), {
        color: {
            dark: '#000',  // Blue dots
            light: '#FFF' // Transparent background
        }
    }, function (err) {
        if (err) throw err


        //TODO ... MAKE GENERIC BASE64 ENCODER AND DECODER FUNCTIONS .. 
        fs.readFile(QRtemp, 'binary', function (err, original_data) {
            type = "image/png";
            var prefix = "data:" + type + ";base64,";
            //fs.writeFile('image_orig.jpg', original_data, 'binary', function (err) { });
            var base64Image = new Buffer(original_data, 'binary').toString('base64');
           // console.log(prefix + base64Image);
            callback(prefix + base64Image);

            //console.log("base64 QR is " + prefix + base64Image);
            //var decodedImage = new Buffer(base64Image, 'base64').toString('binary');
            //fs.writeFile('image_decoded.png', decodedImage, 'binary', function (err) { });
        });
        console.log('done')
    });
    console.log(__dirname);



}


module.exports = { qrGenerate };