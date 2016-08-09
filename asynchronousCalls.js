var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var accountSid = '***myTwilio SID***'; 
var authToken = '***myTwilioAuthToken***';   
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);
var resp = new twilio.TwimlResponse();

var phoneNumbers = [{name: 'sampleName1', number: '1800SAMPLE'},
{name: 'sampleName2', number: '1800SAMPLE'},{name: 'sampleName3', number: '1800SAMPLE'}];


app.post('/makeCall', function (req, res) {
	for (var i in phoneNumbers){
		var callbackUrl = encodeURI('****myEC2URL**:8000/callbackurl?recipientname=' + phoneNumbers[i].name)
		client.makeCall({
		    to: phoneNumbers[i].number, 
		    from: 'myTwilioPhoneNumber', 
		    url: 'http://***myEC2URL***:8000/twimlEndpoint',
		    statusCallback: callbackUrl,
	        statusCallbackMethod: "GET",
	        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"]
			}, function(err) {
				if(err){
				console.log("err:", err);
			}
			else{
				console.log('no errors .. I think');	
			}
		});
	}
	res.send('making calls');
});

app.get('/callbackurl', function (req, res) {
	var status = req.query.CallStatus;
	if(status === 'completed' || status === 'busy' || status === 'no-answer' || status === 'canceled' || status === 'failed' ) {
		console.log('Finished calling', req.query.recipientname);
		console.log('Call status: ', req.query.CallStatus);
		console.log('Call duration: ', req.query.CallDuration);
	}
	res.send('CB ok');
});

app.post('/twimlEndpoint', function (req, res) {
	var twimlOutput = resp.play('***myAWS_S3_URL***');
	res.send(twimlOutput.toString());
});

app.listen(8000, function () {
	console.log('Twilio listening on port 8000!');
});
