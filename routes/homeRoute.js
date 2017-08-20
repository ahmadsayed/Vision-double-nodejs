var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    console.log("Hey I'm in HOME NOW");
    res.send("HOME SWEET HOME");
});


module.exports = router;