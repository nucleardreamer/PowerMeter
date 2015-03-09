var fs = require('fs'),
    path = require('path'),
    json2csv = require('json2csv'),
    _db = require(path.join(__dirname, '..','lib', 'mongo'));

var mongo = new _db(null, function(started){

    console.log(started ? 'mongo good' : 'mongo bad');

    mongo.getAllReadings(function(err, _all){

        json2csv({
            data: _all,
            fields: ['nodeNum', 'time' ,'reading', 'temp', 'excess'],
            fieldNames: ['Node Number', 'Time', 'Power Reading', 'Temperature', 'Wind generation was in excess']
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



