var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var accountSid = '***myTwilio SID***'; 
var authToken = '***myTwilioAuthToken***';   
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);
var resp = new twilio.TwimlResponse();

var phoneNumber = '***RecipientPhoneNumber***';
var numCalls =1;

app.post('/makeCall', function (req, res) {
	makecall(0, phoneNumber);
	res.sendStatus(200);
});


app.get('/callbackurl', function (req, res) {
	var status = req.query.CallStatus;
	var currentCallID = req.query.currentCallID;
	if(status === 'completed' || status === 'busy' || status === 'no-answer' || status === 'canceled' || status === 'failed' ) {
		console.log('currentCallID: ', currentCallID);
		console.log('Call status: ', req.query.CallStatus);
		console.log('Call duration: ', req.query.CallDuration);
		if(currentCallID<numCalls){
			currentCallID++;
			makecall(currentCallID, phoneNumber);
		}
	}
	res.sendStatus(200);
});

app.post('/twimlEndpoint', function (req, res) {
	var twimlOutput = resp.play('***myAWS_S3_URL***');
	res.send(twimlOutput.toString());
	res.sendStatus(200);
});

app.listen(8000, function () {
	console.log('Twilio listening on port 8000!');
});


function makecall(currentCallID, phoneNumber) {
console.log('Calling', phoneNumber, 'with id', currentCallID);

    var callbackUrl = encodeURI('****myEC2URL**:8000/callbackurl??currentCallID='+currentCallID);
    
    console.log("Call number: ", currentCallID);

    client.makeCall({
        to: phoneNumber, 
        from: 'myTwilioPhoneNumber',  
        url: 'http://***myEC2URL***:8000/twimlEndpoint',
        statusCallback:  callbackUrl, 
        statusCallbackMethod: "GET",
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
    }, function(err, call) {
        if(err){
            console.log('Call Error',err);
        }else{
            console.log('Twilio Accepted the call');
        }
    });
}