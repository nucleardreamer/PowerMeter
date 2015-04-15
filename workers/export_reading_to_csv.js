var fs = require('fs'),
    rimraf = require('rimraf'),
    _ = require('lodash'),
    path = require('path'),
    json2csv = require('json2csv'),
    _db = require(path.join(__dirname, '..','lib', 'mongo')),
    newDate = new Date().getTime();

var mongo = new _db(null, function(started){

    console.log(started ? 'mongo good' : 'mongo bad');

    var tmpFileName = __dirname + '/tmp.json';
    var tmpStore = fs.createWriteStream(tmpFileName, { flags : 'w' });

    mongo.getAllReadingsStream(function(doc){

        delete doc._doc._id;
        delete doc._doc.__v;
        tmpStore.write(JSON.stringify(doc) + ',\n');

    }, function(){

        var toCsv = function(parsed){
            console.log('* writing csv: report_readings_'+newDate+'.csv')
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

                var fileName = 'report_readings_'+newDate+'.csv';

                var _path = path.join(__dirname, fileName);

                fs.writeFile(_path, csv, function(err) {
                    if (err) {
                        throw err;
                    } else {
                        rimraf(tmpFileName, function(){
                           process.exit(0) 
                        })
                        
                    }
                });

            });
        }

        console.log('* tmp file written');

        tmpStore.end(function(){
            var _all = fs.readFileSync(tmpFileName)
        
            _all = _all.toString();

            _all = _all.slice(0,-2);
            
            
            _all = JSON.parse('['+_all+']')

            toCsv(_.map(_all, function(item){
                var toRet = _.clone(item);
                toRet.node_0_power = 0;
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
            }))
        })


        

    })

});



