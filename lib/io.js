var serverUrl = (process.env.NODE_ENV == 'production') ? 'http://power-meter.herokuapp.com' : 'http://localhost:8000';

var request = require('request'),
    _ = require('lodash');

var Sockets = function(server, wind, nodes){
    var _this = this;

    var registeredNodes = {};

    var io = require('socket.io')(server);

    io.on('connection', function (socket) {

        console.log('client connect IO', socket.id);

        socket.emit('connection', { connection: true });

        socket.emit('registeredNodes', registeredNodes);

        socket.on('node_register', function(report){
            console.log(socket.id, report);
            registeredNodes[report.nodeNum] = report;
            report.id = socket.id;
            socket.broadcast.emit('node_connect', report);
        });

        socket.on('ping', function (data) {
            console.log(data);
        });

        socket.on('getWindData', function(cb){
            wind.getWindData(cb)
        });

        socket.on('getWindExcessEvents', function(cb){
            wind.getExcessEvents(cb);
        });

        socket.on('getWindDeficitEvents', function(cb){
            wind.getDeficitEvents(cb);
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

        socket.on('disconnect', function(){
            console.log('disconnect', socket.id);
            _.forEach(registeredNodes, function(node){
                if(node.id == socket.id){
                    console.log('* node ' + node.nodeNum + ' disconnected');
                    delete registeredNodes[node.nodeNum];
                    socket.broadcast.emit('node_disconnect', node.nodeNum);
                }
            })
        });

        socket.on('putNodeData', function(nodeData){

            nodes.putNode(nodeData, function(err, data){
                if(!err){
                    if(data.newNode){
                        io.emit('nodeDataAdded', {});
                    } else {
                        io.emit('nodeData', data);
                    }
                }
            });

        });

    });


    return io;
};

module.exports = Sockets;