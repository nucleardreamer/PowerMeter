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
        xAxis: [{
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%I:%M%p'
            },
            title: {
                text: 'Date'
            },
            min: moment().hours(-24).unix() * 1000,
            max: moment().unix() * 1000
        }],
        yAxis: [
            {
                title: {
                    text: 'Power'
                },
                labels: {
                    format: '{value} MW'
                },
                min: 0
            },
            {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                min: 0,
                max: 1,
                ceiling: 1
            }
        ],
        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
            '<td style="text-align: right"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            valueDecimals: 2,
            crosshairs: [true, false]
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            },
            series: {
                borderWidth: 0
            }
        },
        series: [{
            name: 'Base Power',
            type: 'spline',
            yAxis: 0,
            tooltip: {
                valueSuffix: ' MW'
            },
            data: []
        }, {
            name: 'Wind Power',
            type: 'spline',
            yAxis: 0,
            tooltip: {
                valueSuffix: ' MW'
            },
            data: []
        },{
            name: 'Wind Power Excess Event',
            type: 'column',
            yAxis: 1,
            data: []
        },{
            name: 'Wind Power Deficit Event',
            type: 'column',
            yAxis: 1,
            data: []
        }]
    })

};

Wind.prototype.updateChart = function(data){
    var _this = this, baseVal = [], windVal = [];
    _.forEach(data, function(item, k){
        windVal.push([item.date * 1000, item.wind]);
        baseVal.push([item.date * 1000, item.basePt]);
    });
    _this.chart.series[0].setData(baseVal);
    _this.chart.series[1].setData(windVal);
};
Wind.prototype.updateChartExcess = function(data){
    var _this = this, excess = [];
    _.forEach(data, function(item, k){
        excess.push([item.date * 1000, 1]);
    });
    _this.chart.series[2].setData(excess);
};
Wind.prototype.updateChartDeficit = function(data){
    var _this = this, deficit = [];
    _.forEach(data, function(item, k){
        deficit.push([item.date * 1000, 1]);
    });
    _this.chart.series[3].setData(deficit);
};

charts.wind = Wind;