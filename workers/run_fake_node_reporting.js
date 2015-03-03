var request = require('request');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var nodeInterval = function(nodeValue, dataValue){
    //var serverUrl = "http://localhost:8000/api/node";
    var serverUrl = "http://power-meter.herokuapp.com/api/node";

    // options needed in order to send
    var toSendOptions = {
        url: serverUrl,
        method: "PUT",
        // this is our payload that the server reads
        json: {
            nodeNumber: String(nodeValue),
            reading: {
                time: new Date().getTime(),
                data: dataValue
            }
        }
    }

    // the actual request, with our options
    request(toSendOptions, function(err){
        // show an error if it exists, otherwise do nothing
        if(err){
            console.error(err);
        } else {
            console.log('Data sent to server - ', 'Node: ' + nodeValue, 'Value: ' + dataValue);
        }
    });
};

var int = setInterval(function(){

    nodeInterval('0', getRandomInt(10,15));

}, 1000);
