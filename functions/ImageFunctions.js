var Jimp = require("jimp");





var cropImage = function (fielDirectory, fileDestination, startX, startY, width, height, callback) {
    Jimp.read(fielDirectory, function (err, image) {
        image.crop(startX, startY, width, height);
        image.write(fileDestination);         // crop to the given region 
        callback(image);
    }).catch(function (err) {
        console.log("IMAGE CROP ERROR IS: " + err);
    });
}


module.exports = { cropImage };