var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    json2csv = require('json2csv'),
    _db = require(path.join(__dirname, '..','lib', 'mongo'));

var mongo = new _db(null, function(started){

    console.log(started ? 'mongo good' : 'mongo bad');

    mongo.getAllReadings(function(err, _all){

        var parsed = _.map(_all, function(item){
            var toRet = _.clone(item._doc);
            toRet['node_0_power'] = 0;
            toRet.node_0_temp = 0;
            toRet.node_1_power = 0;
            toRet.node_1_temp = 0;
            toRet.node_2_power = 0;
            toRet.node_2_temp = 0;
            toRet.node_3_power = 0;
            toRet.node_3_temp = 0;

            toRet['node_'+toRet.nodeNum+'_power'] = toRet.reading;
            toRet['node_'+toRet.nodeNum+'_temp'] = toRet.temp;
            return toRet;
        });

        json2csv({
            data: parsed,
            fields: [
                'time' ,
                'node_0_power',
                'node_0_temp',
                'node_1_power',
                'node_1_temp',
                'node_2_power',
                'node_2_temp',
                'node_3_power',
                'node_3_temp',
                'excess'
            ],
            fieldNames: [
                'time',
                'node_0_power',
                'node_0_temp',
                'node_1_power',
                'node_1_temp',
                'node_2_power',
                'node_2_temp',
                'node_3_power',
                'node_3_temp',
                'wind_gen_was_excess'
            ]
        }, function(err, csv) {
            if (err) console.log(err);

            var newDate = new Date().getTime(),
                fileName = 'report_readings_'+newDate+'.csv';

            var _path = path.join(__dirname, fileName);

            fs.writeFile(_path, csv, function(err) {
                if (err) {
                    throw err;
                } else {
                    process.exit(0)
                }
            });

        });
    })

});



