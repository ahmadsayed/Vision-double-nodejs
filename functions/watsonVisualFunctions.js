var fs = require("fs");
var watson = require('watson-developer-cloud');
var imageFunc = require(appRoot + "functions/ImageFunctions.js");
var path = require('path');
var os = require('os');
var uuid = require('uuid');


var visual_recognition = watson.visual_recognition({
    api_key: '27482ab3802aefa8daca8862b036554e13a8a00f',
    version: 'v3',
    version_date: '2016-05-20'
});


function detectObjects(imageDirectory, callback) {
    var params = {
        images_file: fs.createReadStream(imageDirectory)
    };


    visual_recognition.classify(params, function (err, objectsDetected) {
        if (err) {
            console.log("Watson Erros is " + err);
        }
        else {
            // console.log(JSON.stringify(objectsDetected, null, 2));

            callback(err, objectsDetected);
        }

    });
}


function detectFaces(imageDirectory, callback) {
    var params = {
        images_file: fs.createReadStream(imageDirectory)
    };
    visual_recognition.detectFaces(params,
        function (err, facesDetected) {
            if (err) {
                console.log(err);
            }
            else {
                //console.log(JSON.stringify(facesDetected, null, 2));

                callback(err, facesDetected);
            }
        });
}


var cropAllFaces = function (fielDirectory, facesDetectedJson, callback) {
    var cropedImagesArr = [];          //ARRAY OF ALL THE CROPED IMAGES
    var counter = 0;
    var totalCounter = 0;
    facesDetectedJson.images.forEach(function (imagesElement) {
        imagesElement.faces.forEach(function (facesElement) {
            totalCounter++;
        });
    });
    //console.log("TOTA IS " + totalCounter);
    //var resource = parseBase64Image(img);                 //IF IMAGE64 --> Handling later

    //images_file = fs.createReadStream(cropedImagesArr[counter]);
    //params.images_file = images_file;
    //console.log("croppy");
    facesDetectedJson.images.forEach(function (imagesElement) {
        imagesElement.faces.forEach(function (facesElement) {
            cropedImagesArr[counter] = path.join(os.tmpdir(), uuid.v1() + '.' + 'jpeg');
            imageFunc.cropImage(fielDirectory, cropedImagesArr[counter], facesElement.face_location.left, facesElement.face_location.top, facesElement.face_location.width, facesElement.face_location.height, function (image) {
               // console.log("image wohoo " + counter);
                if (totalCounter == counter)            //IF IT's Asynchronous .. 
                {
                  //  console.log("finished cropping all..Counter = " + counter + "and doneCounter = " + totalCounter);
                    callback(cropedImagesArr, totalCounter);
                }
            });
            counter++; 
        //    console.log(counter + " insideLoop " + totalCounter);
        }, this);
    }, this);


}



var recognizeFaces = function (fielDirectory, facesDetectedJson, callback) {
    var recognizedFaces = {};
  //  console.log("I'm in recognizing faces");
    var count = 0;
    var err = null;
    cropAllFaces(fielDirectory, facesDetectedJson, function (cropedImagesArr, totalCounter) {
        //console.log("Done croping all faces ");
        //console.log(cropedImagesArr);
      //  console.log(cropedImagesArr);
        cropedImagesArr.forEach(function (cropedImageElement) {
            // CALL WATSON CLASSIFIER HERE TO DETECT EATCH FACE ..
           // console.log("hoss");
            count++;
            if (count === totalCounter) {
            //    console.log("count is " + count + " and total is " + totalCounter);
                callback(err, cropedImagesArr, recognizedFaces);
            }
        });
    });
}



module.exports = { detectObjects, detectFaces, recognizeFaces };