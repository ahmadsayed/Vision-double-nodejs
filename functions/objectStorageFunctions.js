var ObjectStorage = require('bluemix-objectstorage').ObjectStorage;
var pkgcloud = require('pkgcloud');
var fs = require('fs');


var credentials = {
    "auth_url": "https://identity.open.softlayer.com",
    "project": "object_storage_b85a7703_a177_47c9_87de_61218c63f364",
    "projectId": "42a7b8cfcdf8411b8604b3328b37cc7d",
    "region": "dallas",
    "userId": "f174f68566ad4744bfcbeacda12b36cf",
    "username": "admin_7d39827ad4718bfbffe734138811859667774e5a",
    "password": "wV8&_2ZauEj0,okP",
    "domainId": "8617319c72df42cba4310fdb6f2f1dc1",
    "domainName": "1416339",
    "role": "admin"
};

var config = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: 'v3',
    authUrl: credentials.auth_url,
    tenantId: credentials.projectId,    //projectId from credentials
    domainId: credentials.domainId,
    "userId": "c74f5daaa3594816b1351cf403eee41d",
    username: credentials.username,
    password: credentials.password,
    region: 'dallas'   //dallas or london region
};


var storageClient = pkgcloud.storage.createClient(config);


var objectStorage_addImage = function (containerName, fileRemoteName, fileDirectory, callback) {
    storageClient.auth(function (err) {
        if (err) {
            console.error(err);
        }
        else {
            //console.log("PACKAGE IS GOOOOOOD");
            //  console.log(storageClient._identity);
            storageClient.getContainer(containerName, function (err, container) {
                if (err)
                    console.log("ERROR OF CONTAINER IS :" + container);
                else {
                    var imageFile = fs.createReadStream(fileDirectory);

                    var upload = storageClient.upload({
                        container: containerName,
                        remote: fileRemoteName
                    });
                    upload.on('error', function (err) {
                        console.error("UPLOADING FILE ERROR IS : " + err);
                    });
                    upload.on('success', function (file) {
                        console.log("FILE IS INSERTED SUCCESSFULY");
                        console.log("File is " + file.toJSON());
                        //  callback();
                    });
                    imageFile.pipe(upload);
                }
            });
        }
    });
}

module.exports = { objectStorage_addImage };