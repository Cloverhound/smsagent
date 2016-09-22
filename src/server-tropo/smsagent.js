importPackage(java.net);
importPackage(java.io);
importPackage(java.util);

var FIREBASE_INSTANCE = "xxx";

/**
 * Convenience method for POSTing to a URL.
 * Uses underlying Java libraries, adapted from various Java examples.
 * @param {string} urlString The URL to POST to.
 * @param {string} body The data to POST.
 */
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

/**
 * Handle a new incoming SMS.
 */
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

/**
 * Use Tropo API to send an SMS.
 */
function sendSms() {

    message(msg, {
        to:"+" + numberToDial,
        network:"SMS"
    });

    log("Sent " + msg + " to " + numbertoDial);
}

 // If the 'currentCall' variable is set, that means this session was triggered
 // by an inbound SMS. Otherwise this was triggered by an API call, which in our
 // case means we want to send an SMS.
if (currentCall) {
    receivedSms();
} else {
    sendSms();
}
