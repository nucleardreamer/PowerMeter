var url = (process.env.NODE_ENV == 'production') ? "http://www.node-hive.io" : "http://localhost:8000";

var io = require('socket.io-client')(url);
var os = require('os');
io.on('connect', function(socket){
    console.log('connection');
    var reg = {
        nodeNum: 0,
        os: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(),
        mem: {
            total: os.totalmem(),
            free: os.freemem()
        }
    };

    // timeout just to be safe
    setTimeout(function(){
        io.emit('node_register', reg);
    }, 500);

});
io.on('event', function(data){
    console.log('event', data);
});
io.on('disconnect', function(){
    console.log('disconnect')
});