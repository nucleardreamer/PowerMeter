var mongoose = require('mongoose'),
    fs = require('fs'),
    _ = require('lodash');

var db = function(dbUrl, cb){
    var _this = this;
    var mongoUrl = (!_.isUndefined(dbUrl) && !_.isNull(dbUrl)) ? dbUrl : 'localhost/powermeter';
    mongoose.connect('mongodb://' + mongoUrl);

    var db = mongoose.connection;

    db.on('error', function(){
        console.error('connection error:', arguments);
        cb(false);
    });

    db.once('open', function(){
        _this.collections = _this.genModelsAndSchemas();
        cb(true);
    });

    return this;
};

db.prototype.addNewReading = function(input, cb){
    var _this = this;

    var record = new _this.collections.reading.model({
        nodeNum: input.nodeNum,
        time: input.time,
        reading: input.reading,
        temp: input.temp,
        excess: input.excess
    });

    record.save(function(err){
        if(err){
            console.error('Mongo save failed:', err);
            cb(false);
        } else {
            cb(true);
        }
    });
};

db.prototype.getAllReadings = function(cb){
    var _this = this;
    _this.collections.reading.model.find({}, function(err, records){
        cb(err, records)
    })
};

db.prototype.getAllReadingsStream = function(fdata, cb){
    var _this = this;

    _this.collections.reading.model.find({}).limit(0).stream()
        .on('data', fdata)
        .on('close', cb);
};

db.prototype.genModelsAndSchemas = function(){
    var all = {

        reading: {
            schema: mongoose.Schema({
                nodeNum: Number,
                time: Date,
                reading: Number,
                excess: Boolean,
                temp: { type: Number, default: 0 }
            })
        }

    };

    all.reading.model = mongoose.model('reading', all.reading.schema);

    return all;
};

module.exports = db;