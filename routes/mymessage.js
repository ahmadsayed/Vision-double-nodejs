var express = require('express');
var router = express.Router();


router.get('/:name', function (req, res) {
    console.log("HELLO " + req.params.name);
    res.send('This is ' + req.params.name);
});


module.exports = router;