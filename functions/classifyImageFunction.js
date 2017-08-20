// //      classifyImageFunction.js
// var watson = require('watson-developer-cloud');
// var fs = require("fs");
// var classifiedImage;

// var visual_recognition = watson.visual_recognition({
//     api_key: '85994b46554e429e98772c66206de8dd54759076',
//     version: 'v3',
//     version_date: '2016-05-20'
// });

// var params = {
//     images_file: fs.createReadStream('./public/images.png')
// };

// var classify = visual_recognition.classify(params, function (err, res) {
//     if (err)
//         console.log(err);
//     else {
//         console.log(JSON.stringify(res, null, 2));
//         classifiedImage = JSON.stringify(res, null, 2);
//     }
// });

// var classifyImage = function () {c
//     classify();
//     console.log("THIS ISSSS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" + classifiedImagec);
//     return classifiedImage; 
// }

// module.exports = classifyImage;