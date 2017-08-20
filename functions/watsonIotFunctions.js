var iotf = require('ibmiotf');
var Client = iotf.IotfApplication;
var newDeviceObj = require(appRoot + "classes/iotDevice.json").newDeviceData;



var iotAppConfig = {
    "org": 'c7tg7s',
    "id": 'a2g6k39sl6r5',
    "auth-method": "apikey",
    "auth-key": 'a-c7tg7s-ts69roehjj',
    "auth-token": 'D6wlu3b22PEAr*ia9r'
}



var appClient = new Client(iotAppConfig);



var watsonIotPlatform_Connect = function (callback) {
    appClient.connect();
    console.log("Successfully connected to our IoT service!");

    // subscribe to input events 
    appClient.on("connect", function () {
        console.log("subscribe to input events");
        appClient.subscribeToDeviceEvents();
        //appClient.subscribeToDeviceEvents("raspberrypi");

        callback();
    });
}


var watsonIotPlatform_addNewDevice = function (newDeviceData, callback) {
    newDeviceObj = JSON.parse(JSON.stringify(newDeviceData));
    //console.log(JSON.stringify(newDeviceObj, null, 2));    //FOR TESTING

    //ADD NEW DEVICE 
    appClient.registerDevice('RaspberryPI', "new01012220", 'tokenHOSS12345').then(function onSuccess(argument) {
        console.log("Success");
        console.log(argument);
        callback(null, argument);
    }, function onError(argument) {
        console.log("Fail");
        console.log(argument.data);
        callback(argument.data, argument);
    });

}


var watsonIotPlatform_addNewDevice_fullData = function (newDeviceData, callback) {
    // TO BE DEVELOPED
    // var request = require('request');

    // // Set the headers
    // var headers = {
    //     'User-Agent': 'Super Agent/0.0.1',
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // }

    // // Configure the request
    // var options = {
    //     url: 'http://samwize.com',
    //     method: 'POST',
    //     headers: headers,
    //     //headers: {'Content-Type': 'application/json'},

    //     form: { 'key1': 'xxx', 'key2': 'yyy' }
    // }

    // // Start the request
    // request(options, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         // Print out the response body
    //         console.log(body)
    //     }
    // });
}


module.exports = { watsonIotPlatform_Connect, watsonIotPlatform_addNewDevice, watsonIotPlatform_addNewDevice_fullData };