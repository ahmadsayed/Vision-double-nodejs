var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
var qrFunction = require(appRoot + "functions/qrFunctions.js");

var express = require('express');
var app = express();
var router = express.Router();
var slackRouter = express.Router();
// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  username: '8d71c632-bd2c-4228-94cd-ca35ed423a5c',
  password: 'SenYHrhCRZg1',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});

// Endpoint to be call from the client side
router.post('/sendchatmessage', function (req, res) {

  processWatson(req, res, function(message) {
        res.json(message);
    });
});

slackRouter.post('/slackprecessor', function (req, res) {

  req.body = {"input" : req.body};
  processWatson(req, res, function(message) {
        message = {"text" : message.output.text[0]};
        res.json(message);
    }
    );
});

function processWatson(req, res, hook) {
  var workspace = process.env.WORKSPACE_ID || 'bb169a77-7664-48d8-8792-82deff11e448';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: 'bb169a77-7664-48d8-8792-82deff11e448',
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function (err, data) {      //data here has the chat responce 
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    // WE CAN DO ANYTHING WITH THE DATA HERE .. (The responce from the conversation service)
    var responceJson = updateMessage(payload, data, function () { });
    if (responceJson.output.text[0].search('_getQr_') !== -1)      //FOUND _getQR_
    {
      qrFunction.qrGenerate(function (qrBase64) {
        console.log("QR REQUESTED !!!!!!!!");
        responceJson.otherResources = {};
        responceJson.otherResources.resourceType = "QR";

        responceJson.otherResources.resourceObject = qrBase64;
        //console.log("from watson :"+ responceJson.otherResources.resourceObject);
        responceJson.output.text[0] = responceJson.output.text[0].replace("_getQr_", "");
        return hook(responceJson);
      });
    }
    else {
      return hook(responceJson);
    }

    //return res.json(responceJson);
  });

}
/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response, callback) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports =  { router, slackRouter};     
