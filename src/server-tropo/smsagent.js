importPackage(java.net);
importPackage(java.io);
importPackage(java.util);

var FIREBASE_INSTANCE = "xxx";

function post(urlString, body) {
    var url = new URL(urlString);
    log("Opening connection.");
    var connection = url.openConnection();
    connection.setRequestMethod("POST");
    connection.setDoOutput(true);
    connection.setRequestProperty('Content-Type', 'application/json');

    log("Sending output.");
    var output = new DataOutputStream(connection.getOutputStream());
    output.writeBytes(body);
    output.flush();
    output.close();
    
    var responseCode = connection.getResponseCode();
    log("Response is: " + responseCode);

    var scanner = new Scanner(connection.getInputStream(), "UTF-8").useDelimiter("\\A");  
    var result = scanner.next();
    scanner.close();
    return [responseCode, result];  
}

function receivedSms() {

    var body = {
        message: currentCall.initialText,
        direction: "in",
        timestamp: { ".sv": "timestamp" }
    };
    
    var bodyJson = JSON.stringify(body);
    
    var firebaseUrl = "https://" + FIREBASE_INSTANCE + ".firebaseio.com/clients/test/" + currentCall.callerID + "/messages.json";
    
    log("Posting.");
    var result = post(firebaseUrl, bodyJson);
    log("HTTP response code: " + result[0]);
    log("HTTP body: " + result[1]);
}

function sendSms() {

    message(msg, {
        to:"+" + numberToDial,
        network:"SMS"
    });

    log("Sent " + msg + " to " + numbertoDial);
}


if (currentCall) {
    receivedSms();
} else {
    sendSms();
}
