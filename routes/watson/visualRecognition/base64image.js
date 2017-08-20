var express = require('express');
var router = express.Router();
var fs = require("fs");
var multer = require('multer');          // v1.0.5
var upload = multer();                   // for parsing multipart/form-data
var watson = require('watson-developer-cloud');
var watsonVisual = require(appRoot + 'functions/watsonVisualFunctions.js');
var twilioFunc = require(appRoot + "functions/twilioFunctions.js");
var imageFunc = require(appRoot + "functions/ImageFunctions.js");
var Base64Decode = require('base64-stream').decode;
var cloudantFunc = require(appRoot + "functions/cloudantFunctions.js");
var objectStorageFunc = require(appRoot + "functions/objectStorageFunctions.js");
var path = require('path');
var path = require('path');
var os = require('os');
var uuid = require('uuid');


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


router.post('/', upload.array(), function (req, res, next) {
    //   var base64Data = req.body.image64.replace(/^data:image\/jpeg;base64,/, "");
    //var base64Data = new Base64Decode(req.body.image64);
    //  var imageDirectory = appRoot + "resources/frames/frame.jpeg";
    // console.log("New frame has been sent !");
    var resource = parseBase64Image(req.body.image64);
    var imageSentTemp = path.join(os.tmpdir(), uuid.v1() + '.' + resource.type);
    fs.writeFileSync(imageSentTemp, resource.data);
    var detectObjectsCheck = 0, recognizeFacesCheck = 0, danger = 0, dangerObjectscheck = 0;
    var ObjectsDetected = {};
    var facesDetected = {};

    //STEP ONE: Detect Objects
    watsonVisual.detectObjects(imageSentTemp, function (err, ObjDetected) {
        ObjectsDetected = ObjDetected;
        //  console.log("Objects Detected");
        if (err) { console.log("VR ObjectDet ERROR: " + err); }
        //  console.log("OBJECTS CLASSIFIED ");
        //  console.log (JSON.stringify(ObjectsDetected,null,2));
        
         detectObjectsCheck = 1;

        ////////////////////// CHECK DANGER AND DO SOMETHING 
        ObjectsDetected.images.forEach(function (imagesElement) {
            imagesElement.classifiers.forEach(function (classifiersElement) {
                classifiersElement.classes.forEach(function (classesElement) {
                    //HERE WE SHOULD CHECK EACH CLASS => If it belongs to any kind of Dangerous OBJECTS
                    if (classesElement.class == "weapon" || classesElement.class == "fire") {
                        // HERE WE SEND ALERT MESSAGE
                        danger = 1;
                    }
                }, this);
            }, this);
        }, this);
        dangerObjectscheck = 1;
    });


    /////////////STEP TWO : Detect Faces
    watsonVisual.detectFaces(imageSentTemp, function (err, fcDetected) {
        //   console.log("Faces Detected");
        facesDetected = fcDetected;
        if (err) { console.log("VR facesDet ERROR: " + err); }
        //   console.log("FACES CLASSIFIED ");          
        //  console.log (JSON.stringify(facesDetected,null,2));

        /////////////STEP THREE : RECOGNIZE FACES
        watsonVisual.recognizeFaces(imageSentTemp, facesDetected, function (err, cropedImagesArr, facesRecognized) {
            //HERE WE SHOULD STORE THE PHOTOS IN OBJECT STORAGE
            //   console.log("FACES are Recognized");
            //console.log(cropedImagesArr);
            console.log(facesRecognized);
            if (err) { console.log("VR faces Recognized ERROR: " + err); }
            //    console.log("Faces Recognized " + facesRecognized);

            recognizeFacesCheck = 1;
            //ON SUCCESS OF STEP 1 AND STEP 2 AND STEP 3 
            // console.log(detectObjectsCheck + " and " + recognizeFacesCheck);
            if (detectObjectsCheck === 1 && recognizeFacesCheck === 1) {
                console.log("HI HOSSHOSSSS");
                //  console.log("DONE DETECTION OF OBJECTS AND FACES");
                //ON SUCCESS
                //// CLOUDANT : Generate the event and Save it in cloudant..
                var event = {
                    "frameId": "a489ec71e93e96f5736532a06a2d7386",
                    "frameTitle": "Salma 5.jpg",
                    "cameraId": "double-vision-cam",
                    "frameTime": "1484031591205",
                    "visualRecognitionClasses": ObjectsDetected,
                    "faceIdentificationClass": facesDetected
                }
                cloudantFunc.insertDoc("events_db", event);
                console.log("after effects");


                // Here we should send images to object storage ?????   cropedImagesArr ==> Object Storage
                var imageNamescounter = 0;
                cropedImagesArr.forEach(function (cropedImageDirectory) {
                    objectStorageFunc.objectStorage_addImage('faces_images',  uuid.v1() + '.' + "jpeg", cropedImageDirectory, function () {

                    });
                    imageNamescounter++;
                });



                //CHECK DANGER HERE
                //////////// TWILO : SENDING ALERT MESSAGE ON PHONE
                if (dangerObjectscheck === 1) {
                    if (danger === 1) {   //IF THERE IS ANY DANGER DO SOMETHING ..
                        danger = 0;
                        // twilioFunc.sendAlert();
                    }
                }
            }

        });
    });

    res.send(req.body.image64);
});





module.exports = router;        