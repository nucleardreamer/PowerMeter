var Wind = function(container){
    var _this = this;
    _this.container = container;
    _this.init();
};

Wind.prototype.init = function(){
    var _this = this;

    _this.chart = new Highcharts.Chart({
        chart: {
            renderTo: _this.container.replace('#',''),
            type: 'spline',
            zoomType: 'x'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'wind power readings ('+moment().format('MMM DD, YYYY').toString()+')'
        },
        subtitle: {
            text: 'updated at five minute intervals'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%I:%M%p'
            },
            title: {
                text: 'Date'
            },
            min: moment().startOf('day').unix() * 1000,
            max: moment().endOf('day').unix() * 1000,
        },
        yAxis: {
            title: {
                text: 'Power (MW)'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e %b %I:%M%p}: {point.y}'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Base Power (MW)',
            data: []
        }, {
            name: 'Wind Power (MW)',
            data: []
        }]
    })

};

Wind.prototype.updateChart = function(data){
    var _this = this, baseVal = [], windVal = [];
    _.forEach(data, function(item, k){
        windVal.push([item.date * 1000, parseInt(item.wind)]);
        baseVal.push([item.date * 1000, parseInt(item.basePt)]);
    });
    _this.chart.series[0].setData(baseVal);
    _this.chart.series[1].setData(windVal);
};

charts.wind = Wind;