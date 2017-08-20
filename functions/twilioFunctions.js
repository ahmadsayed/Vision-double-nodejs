var twilio = require('twilio');

var sendAlert = function () {
    sendSms("Alert! Danger in the room", "+201009560620", function () { });
}

var sendNewCameraSms = function () {
    sendSms("A camera has been added","+201203477380", function () { });
}

var sendSms = function (msg, number, callback) {
    var accountSid = 'AC1e6c9504c0bca405606b510e91fa7f3c'; // Your Account SID from www.twilio.com/console
    var authToken = '106c0473b55adf12b3a9f2cd4d01cc60';   // Your Auth Token from www.twilio.com/console
    var client = new twilio(accountSid, authToken);
    client.messages.create({
        body: msg,
        to: number,
        from: "+13235082074"
    }, function (err, sms) {
        if (err) { console.log(err.messages); }
        process.stdout.write("SMS Success, The SMS SID SENT IS :" + sms.sid);

        callback();
    });
}
module.exports = { sendSms, sendAlert, sendNewCameraSms };