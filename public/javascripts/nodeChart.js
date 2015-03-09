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
        },
        yAxis: {
            title: {
                text: 'Node Power'
            }
        },
        tooltip: {
            shared: false,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            '<td style="text-align: right"><b>{point.y} Watts</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 2,
            crosshairs: [true, true]
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
                allValues.push([read.time, parseFloat(read.data)])
            });
            allValues = _.sortBy(allValues, 'date');
            _this.chart.addSeries({
                name: nodeNames[k],
                data: allValues,
                step: true
            }, true);

        });
        _this.chart.redraw();
    }
};

Node.prototype.updateOneValue = function(data){
    var _this = this;
    if(data){
        var nodeNum = parseInt(data.node);
        _.forEach(_this.chart.series, function(series, k){
            if(series.name == nodeNames[nodeNum]){
                _this.chart.series[k].addPoint([data.reading.time, parseFloat(data.reading.data)], false)
            }
        });
        _this.chart.redraw();
    }

};

charts.node = Node;