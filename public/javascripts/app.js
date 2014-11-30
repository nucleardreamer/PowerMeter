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
            data: []
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
            text: 'Temperature Live Raw Values'
        },
        //xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
        loading: false
    };

    var chartData = $scope.chartConfig.series;

    var pullReadingData = function(){
        $http.get('/node/500')
            .success(function(data, status){
                $scope.data = data;

                _.forEach(data, function(item, k){
                    if(_.isUndefined(chartData[k])){
                        chartData[k] = [];
                    } else {
                        var mapped = _.map(item.readings, function(i){
                            return i.data;
                        })
                        console.log(item.readings, mapped);
                        chartData[k].data = mapped;
                        console.log($scope.chartConfig.series[k].data);
                    }
                });

            })
            .error(function(data, status){
                console.error(data, status)
            })
    }



    pullReadingData();
    setInterval(pullReadingData, 1000);






});