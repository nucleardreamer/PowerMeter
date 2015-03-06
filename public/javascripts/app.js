var socket = io.connect();

Highcharts.setOptions({
    global : {
        useUTC : false
    }
});

(function($){

    var allNodes = new RealtimeNodes();

    socket.on('connection', function (data) {

        console.log(data);

        var windChart = new charts.wind('#windChart');

        socket.emit('getWindData', function(data){
            windChart.updateChart(data);
        });

        socket.emit('getWindExcessEvents', function(data){
            windChart.updateChartExcess(data);
        });

        socket.emit('getWindDeficitEvents', function(data){
            windChart.updateChartDeficit(data);
        });

        var nodeChart = new charts.node('#nodeChart');

        socket.emit('getNodeData', function(data){
            nodeChart.updateChart(data);
        });

        socket.on('nodeData', function(data){
            nodeChart.updateOneValue(data);
        });

        socket.on('nodeDataAdded', function(){
            location.reload();
        });

        socket.on('registeredNodes', function(nodes){
            if(_.size(nodes)){
                allNodes.update(nodes);
            }
        });

        socket.on('node_connect', function(node){
            allNodes.update([node]);
        });

        socket.on('node_disconnect', function(node){
            allNodes.offline(node);
        });

    }).on('disconnect', function(){
        $('.disconnected').addClass('false');

    }).on('reconnect', function(){
        $('.disconnected').removeClass('false');

    });



})(jQuery);