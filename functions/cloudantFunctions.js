var Cloudant = require('cloudant');


var Id = '43e248c8-a145-40db-81c1-d7864b6142fe-bluemix'; // Set this to your own account
var password = '08be891810623ed470ca724a40d3d09a0a7c40c03e8d722d3b3496282e89d4f4';
var cloudant = Cloudant({ account: Id, password: password });

var initiateCloudant = function (accID, accPass) {
    Id = accID;
    password = accPass;
    var cloudant = Cloudant({ account: Id, password: password });
}
var getDbList = function (db, body) {
    // Initialize the library with my account.
    cloudant.db.list(function (err, allDbs) {
        console.log('All my databases: %s', allDbs.join(', '))
    });
}

var insertDoc = function (db, documentBody) {
    var db = cloudant.db.use(db);
    db.insert(documentBody, function (err, body, header) {
        if (err) {
            return console.log('Cloudant Error: ', err.message);
        }
        console.log('You have inserted a doc.');
        console.log(body);
    });
}

module.exports = { insertDoc, getDbList, initiateCloudant };