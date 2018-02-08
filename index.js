const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.https.onRequest((req, res) => {

  if (req.method != "POST") {
    res.status(400).send("Invalid function");
    return;
  }
  if (req.body.FCMToken == '' || req.body.title == '' || req.body.message == '') {
    res.status(400).send("Invalid Parameters");
    return;
  }
  var registrationToken = req.body.FCMToken;
  var m_title = req.body.title;
  var message = req.body.message;

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
    notification: {
      title: m_title,
      body: message,
      sound: 'default'
    }
  };

  // Set the message as high priority and have it expire after 24 hours.
  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function (response) {
      console.log("Successfully sent message:", response);
      res.send(response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
      res.send(error);
    });
});