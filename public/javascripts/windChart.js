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
            text: 'last 24 hours, updated at five minute intervals'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%I:%M%p'
            },
            title: {
                text: 'Date'
            },
            min: moment().hours(-24).unix() * 1000,
            max: moment().unix() * 1000,
        },
        yAxis: {
            title: {
                text: 'Power (MW)'
            },
            min: 0
        },
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            '<td style="text-align: right"><b>{point.y} MW</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 2,
            crosshairs: [true, false]
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Base Power',
            data: []
        }, {
            name: 'Wind Power',
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