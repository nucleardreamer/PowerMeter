function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var serverUrl = (process.env.NODE_ENV == 'production') ? "http://power-meter.herokuapp.com" : "http://localhost:8000";

var Reporter = require('./node_socket');

var reporter = new Reporter(0, serverUrl);

var io = reporter.io;

var dataRun = function(nodeValue, dataValue){

        var dataToSend = {
            nodeNumber: String(nodeValue),
            reading: {
                time: new Date().getTime(),
                data: dataValue
            }
        };
        console.log('SENDING DATA', dataToSend);
        io.emit('putNodeData', dataToSend);

};

var int = function(){
    dataRun('0', getRandomInt(10,15));
    setTimeout(int, 1000)
};

int();