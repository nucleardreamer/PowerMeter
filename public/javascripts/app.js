var app = angular.module('windPower', ['highcharts-ng']);

app.controller('readingsController', function ($scope, $http) {
    $scope.data = {empty: true};

    $scope.chartConfig = {
        useHighStocks: false,
        options: {
            chart: {
                type: 'spline',
                zoomType: 'x'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        title: {
            text: 'Wind '
        },
        //xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
        loading: false
    };

    var chartData = $scope.chartConfig.series[0].data;

    var pullReadingData = function(){
        $http.get('/node/10')
            .success(function(data, status){
                $scope.data = data;
                chartData.push(Math.random())
            })
            .error(function(data, status){
                console.error(data, status)
            })
    }



    pullReadingData();
    setInterval(pullReadingData, 1000);






});