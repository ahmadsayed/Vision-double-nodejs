var express = require('express');
var router = express.Router();
var fs = require("fs");
var multer = require('multer');          // v1.0.5
var upload = multer();                   // for parsing multipart/form-data


router.post('/camerastatus', function (req, res, next) {
    


    res.send("OK PEACE");

});


module.exports = router;