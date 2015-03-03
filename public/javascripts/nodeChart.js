var Node = function(container){
    var _this = this;
    _this.container = container;
    _this.init();
};

Node.prototype.init = function(){
    var _this = this;

    _this.chart = new Highcharts.StockChart({
        chart: {
            renderTo: _this.container.replace('#',''),
            type: 'spline',
            zoomType: 'x'
        },
        legend: {
            enabled: true
        },
        rangeSelector: {
            buttons: [{
                count: 30,
                type: 'second',
                text: '30S'
            },{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            },{
                count: 1,
                type: 'hour',
                text: '1H'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'power nodes'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                second: '%I:%M:%S%p',
                minute: '%I:%M:%S%p',
                hour: '%I:%M:%S%p',
                day: '%I:%M:%S%p',
                week: '%I:%M:%S%p',
                month: '%I:%M:%S%p'
            },
            title: {
                text: 'Date'
            }
            //ordinal: false,
            //tickInterval: 10 * 1000
            //min: moment().startOf('minute').unix() * 1000,
            //max: moment().endOf('minute').unix() * 1000
            //tickPositioner: function(min,max){
            //    //var act = min,
            //    //    ticks = [];
            //    //console.log(this);
            //    //while(act <= max){
            //    //    ticks.push(act);
            //    //    act+= this.tickInterval;
            //    //}
            //    //this.tickPosition = moment().unix() * 1000;
            //    //this.min = moment().startOf('minute').unix() * 1000;
            //    //this.max = moment().endOf('minute').unix() * 1000;
            //    //return ticks;
            //    return moment().unix() * 1000
            //}
        },
        yAxis: {
            title: {
                text: 'Node Power'
            }
        },
        tooltip: {

            pointFormat: '{point.x:%e %b %I:%M%p}: {point.y}'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            }
        },
        series: []
    });

};

Node.prototype.updateChart = function(data){
    var _this = this;
    if(data) {
        _.forEach(data, function (item, k) {
            var allValues = [];
            _.map(item.readings, function (read) {
                allValues.push([read.time, read.data])
            });
            _this.chart.addSeries({
                name: nodeNames[k],
                data: allValues
            });
        });

    }
};

Node.prototype.updateOneValue = function(data){
    var _this = this;
    if(data){
        var nodeNum = parseInt(data.node);
        _.forEach(_this.chart.series, function(series, k){
            if(series.name == nodeNames[nodeNum]){

                _this.chart.series[k].addPoint([data.reading.time, data.reading.data])
            }
        })
    }

};

charts.node = Node;