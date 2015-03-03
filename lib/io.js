var serverUrl = (process.env.NODE_ENV == 'production') ? 'http://power-meter.herokuapp.com' : 'http://localhost:8000';

var request = require('request');

var Sockets = function(server, wind){
    var _this = this;

    var io = require('socket.io')(server);

    io.on('connection', function (socket) {

        console.dir(socket.id);
        socket.emit('connection', { connection: true });

        socket.on('ping', function (data) {
            console.log(data);
        });

        socket.on('getWindData', function(cb){
            wind.getWindData(cb)
        });

        socket.on('getNodeData', function(cb){
            var url = serverUrl + '/api/node/500';
            console.log('getNodeData URL:', url);
            request({
                url: url,
                method: 'GET',
                json: true
            }, function(err, res, body){
                if(err){
                    console.log(err);
                } else {
                    console.log('GET ALL NODE DATA IO:', body[0]);
                    cb(body || {});
                }
            })
        });

    });

    return io;
};

module.exports = Sockets;