var app = angular.module('windPower', []);

app.controller('readingsController', function ($scope, $http) {
    $scope.data = {empty: true};


    var pullReadingData = function(){
        $http.get('/node')
            .success(function(data, status){
                $scope.data = data;
            })
            .error(function(data, status){
                console.error(data, status)
            })
    }

    pullReadingData()
    setInterval(pullReadingData, 250)
});