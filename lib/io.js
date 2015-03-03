var serverUrl = (process.env.NODE_ENV == 'production') ? 'http://power-meter.herokuapp.com' : 'http://localhost:8000';

var request = require('request');

var Sockets = function(server, wind, ee){
    var _this = this;

    var io = require('socket.io')(server);
    var redis = require('socket.io-redis');

    io.adapter(redis(process.env.REDISTOGO_URL || { host: 'localhost', port: 6379 }));

    io.on('connection', function (socket) {
        console.dir(socket.id);
        socket.emit('connection', { connection: 'hello' });
        socket.on('ping', function (data) {
            console.log(data);
        });

        socket.on('getWindData', function(cb){
            console.log('GET WIND DATA IO')
            wind.getWindData(cb)
        });

        socket.on('getNodeData', function(cb){
            request({
                url: serverUrl + '/api/node/500',
                method: 'GET',
                json: true
            }, function(err, res, body){
                console.log('GET NODE DATA IO')
                cb(body);
            })
        });

        ee.on('nodeReport', function(nodeReport){
            console.log('NODE REPORT IO')
            socket.emit('nodeValue', nodeReport)
        });

    });
};



module.exports = Sockets;