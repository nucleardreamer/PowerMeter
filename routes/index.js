var express = require('express');
var _ = require('lodash');
var router = express.Router();
var path = require('path');

module.exports = function(ee, wind) {

    var incomingResults = {};

    router.get('/', function (req, res) {
        res.render('index', {
            title: 'Power Meter'
        });
    });
    router.get('/dashboard', function (req, res) {
        res.render('dashboard', {
            title: 'Power Meter'
        });
    });

    router.get('/api/getAllWindReadings', function (req, res) {
        if (wind.ready) {
            wind.getWindData(function (data) {
                res.json(data);
            })
        } else {
            res.send(501);
        }
    });

    router.get('/api/getLastWindReading', function (req, res) {
        if (wind.ready) {
            wind.getLastReading(function (data) {
                res.json(data);
            })
        } else {
            res.send(501);
        }
    });

    router.put('/api/node', function (req, res) {
        console.log('req', req.body, req.params);

        var data = req.body;

        console.log(data);
        if (_.isUndefined(incomingResults[data.nodeNumber])) {
            incomingResults[data.nodeNumber] = {
                readings: []
            }
        }
        if (incomingResults[data.nodeNumber].readings.length >= 500) {
            incomingResults[data.nodeNumber].readings = _.last(incomingResults[data.nodeNumber].readings, 499)
        }

        incomingResults[data.nodeNumber].readings.push(data.reading);

        console.log('NODE DATA READINGS:', data.nodeNumber,incomingResults[data.nodeNumber].readings.length);

        ee.emit('nodeReport', {
            node: data.nodeNumber,
            reading: data.reading
        });

        res.status(200).end();

    });

    router.get('/api/node/:lastNum', function (req, res) {
        console.log('incomingResults:', incomingResults.length)
        var lastNum = parseInt(req.params.lastNum);
        if (lastNum == 0) {
            res.json(incomingResults || {});
        } else {
            if(incomingResults.length) {
                var incomingResultsLimited = _.cloneDeep(incomingResults);
                _.forEach(incomingResultsLimited, function (item, k) {
                    console.log('item', item, k);
                    incomingResultsLimited[k].readings = _.last(incomingResultsLimited[k].readings, lastNum);
                });
                res.json(incomingResultsLimited);
            } else {
                res.json({})
            }
        }

    });

    router.get('/ping', function (req, res) {
        res.status(200).end();
    });

    return router;

};

