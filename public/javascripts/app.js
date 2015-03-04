var socket = io.connect();

var charts = {};

var nodeNames = ['Alpha', 'Beta', 'Gamma', 'Delta'];

Highcharts.setOptions({
    global : {
        useUTC : false
    }
});

(function($){

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
            console.log('getNodeData', data);
            nodeChart.updateChart(data);
        });

        socket.on('nodeData', function(data){
            console.log('NODE VALUE');
            console.log(arguments);
            nodeChart.updateOneValue(data);
        });

        socket.on('nodeDataAdded', function(){
            console.log('NEW NODE ADDED');
            location.reload();
        });


    }).on('disconnect', function(){
        $('.disconnected').addClass('false');
        console.log('disconnect', arguments)
    }).on('reconnect', function(){
        $('.disconnected').removeClass('false');
        console.log('reconnect', arguments)
    })

})(jQuery);