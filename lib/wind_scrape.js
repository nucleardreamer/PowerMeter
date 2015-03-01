var request = require('request'),
    _ = require('lodash'),
    moment = require('moment');

var Wind = function(){
    var _this = this;

    _this.mainUrl = 'http://transmission.bpa.gov/business/operations/Wind/twndbspt.txt';
    _this.ready = false;
    _this.data = [];
    _this.init();

}

Wind.prototype.init = function(){
    var _this = this;

    request(_this.mainUrl, function(err, resp, body){
        _this.data = _.sortBy(_.map(_this.parseResponseBody(body), function(item){

            item.date = moment(item.date).unix();
            return item;

        }),'date');
        console.log('WIND parse ready');
        _this.ready = true;
    })
};


Wind.prototype.getWindData = function(cb){
    var _this = this;

    cb(_this.data);
};

Wind.prototype.getLastReading = function(cb){
    var _this = this;
    if(_this.ready){
        cb(_.last(_this.data));
    } else {
        cb(false)
    }

};

Wind.prototype.parseResponseBody = function(raw) {
    var readings = [];
    var rawLines = raw.split("\r\n");
    var headerLineNum = rawLines.indexOf('Date/Time       \tBasept\tWind\tOvrspMit');

    var dataLines = rawLines.slice(headerLineNum + 1, rawLines.length - 1);
    var parsedLine;

    for (var i = 0; i <  dataLines.length; i++) {
        if (parsedLine = this.parseLine(dataLines[i])) {
            readings.push(parsedLine);
        }
    }

    return readings;
};

Wind.prototype.parseLine = function(rawLine) {
    var reading = {};

    var fields = rawLine.split("\t");

    reading.date = fields[0];
    reading.basePt = fields[1];
    reading.wind = fields[2];
    reading.ovrspMit = fields[3];

    return _.isEmpty(reading.basePt) && _.isEmpty(reading.wind) ? null : reading;
};


module.exports = new Wind();