var express = require('express');
var router = express.Router();
var fs = require("fs");
var multer = require('multer');          // v1.0.5
var upload = multer();                   // for parsing multipart/form-data
var watson = require('watson-developer-cloud');


function classifyImage() {
    var visual_recognition = watson.visual_recognition({
        api_key: '85994b46554e429e98772c66206de8dd54759076',
        version: 'v3',
        version_date: '2016-05-20'
    });

    var params =  {
        images_file: fs.createReadStream('public/images/out.jpeg')
    };


    var classifiedImage;
    visual_recognition.classify(params, function (err, res) {
        if (err)
            console.log("Watson Erros is " + err);
        else {
            console.log("SO SO SO " + JSON.stringify(res, null, 2));
            classifiedImage = JSON.stringify(res, null, 2);
        }
    });
    console.log("THIS ISSSS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" + classifiedImage);
    return classifiedImage;
}

module.exports = classifyImage;