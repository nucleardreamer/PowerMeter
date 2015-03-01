var app = angular.module('windPower', ['highcharts-ng']);

// wind data

app.controller('windReadingsController', function ($scope, $http) {
    $scope.data = {empty: true};

    $scope.chartConfig = {
        useHighStocks: false,
        options: {
            chart: {
                type: 'spline',
                zoomType: 'x'
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
            },
        },
        series: [{
            name: 'basePt',

            data: []
        }, {
            name: 'wind',
            data: []
        }],
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                month: '%D - %R',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'MW'
            }
        },
        title: {
            text: 'Wind Power Values'
        },
        loading: false
    };



    var chartData = $scope.chartConfig.series;

    var pullReadingData = function(){
        $http.get('/api/getAllWindReadings')
            .success(function(data, status){
                $scope.data = data;


                _.forEach(data, function(item, k){
                    console.log(item.date);
                    chartData[0].data.push([item.date, parseInt(item.basePt)]);
                    chartData[1].data.push([item.date, parseInt(item.wind)]);
                });

            })
            .error(function(data, status){
                console.error(data, status)
            })
    };


    pullReadingData();

});






// our data

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
            text: 'Node Energy Raw Values'
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
                        chartData[k] = {data:[]};
                    } else {
                        var mapped = _.map(item.readings, function(i){
                            return i.data;
                        });
                        console.log(item.readings, mapped);
                        chartData[k].data = mapped;
                        console.log($scope.chartConfig.series[k].data);
                    }
                });

            })
            .error(function(data, status){
                console.error(data, status)
            })
    };


    pullReadingData();
    setInterval(pullReadingData, 1000);


});