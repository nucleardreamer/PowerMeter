var request = require('request'),
    _ = require('lodash'),
    moment = require('moment');

var Wind = function(){
    var _this = this;
    _this.mainUrl = 'http://transmission.bpa.gov/business/operations/Wind/twndbspt.txt';
    _this.ready = false;
    _this.data = [];
    _this.excessPoints = [];
    _this.deficitPoints = [];
    _this.init();
};

Wind.prototype.init = function(cb){
    var _this = this;
    _this.ready = false;
    request(_this.mainUrl, function(err, resp, body){
        _this.data = _.sortBy(_.map(_this.parseResponseBody(body), function(item){
            item.date = moment(item.date).unix();
            item.basePt = parseInt(item.basePt);
            item.wind = parseInt(item.wind);
            return item;
        }),'date');

        _this.calcExcessPoints(function(excess, deficit){
            _this.excessPoints = excess;
            _this.deficitPoints = deficit;

            _this.ready = true;

            if(cb) cb(_this.data);
        });


    })
};

Wind.prototype.calcExcessPoints = function(cb){
    var _this = this;

    var excess = [], deficit = [];
    var dataSize = _.size(_this.data);

    var windIsAbove = function(event){
        if(event) {
            return event.wind > event.basePt;
        }
    };

    // loop through all wind data points
    _.forEach(_this.data, function(e, k){
        // make sure key is not the first and last
        if(k > 0 && k !== dataSize && _this.data[k-1] && _this.data[k+1]){
            // if wind is above, and last event it wasn't, and next event it is
            if(windIsAbove(e) && !windIsAbove(_this.data[k-1]) && windIsAbove(_this.data[k+1])){
                e.diff = e.wind - e.basePt;
                excess.push(e);
            } else if(!windIsAbove(e) && windIsAbove(_this.data[k-1]) && !windIsAbove(_this.data[k+1])){
                e.diff = e.basePt - e.wind;
                deficit.push(e);
            }
        }
    });

    cb(excess, deficit);
};

Wind.prototype.getExcessEvents = function(cb){
    var _this = this;
    if(_this.ready){
        cb(_this.excessPoints);
    }
};

Wind.prototype.getExcessEventsAfterTime = function(time, cb){
    var _this = this;
    if(_this.ready){
        cb(_.compact(_.map(_this.excessPoints, function(e){
            if(moment.unix(e.date).isAfter(moment.unix(time))){
                return e;
            }
        })));
    }
};

Wind.prototype.getDeficitEvents = function(cb){
    var _this = this;
    if(_this.ready){
        cb(_this.deficitPoints);
    }
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


module.exports = Wind;