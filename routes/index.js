var express = require('express');
var _ = require('lodash');
var path = require('path');

module.exports = function(app, wind, nodes, io) {

    app.get('/', function (req, res) {
        res.render('index', {
            title: 'Node Hive'
        });
    });
    app.get('/dashboard', function (req, res) {
        wind.getLastReading(function (data) {
            res.render('dashboard', {
                title: 'Node Hive',
                lastReading: data
            });
        })

    });

    app.get('/api/getAllWindReadings', function (req, res) {
        if (wind.ready) {
            wind.getWindData(function (data) {
                res.json(data);
            })
        } else {
            res.send(500);
        }
    });

    app.get('/api/refreshWindReadings', function (req, res) {
        if (wind.ready) {
            wind.getWindData(function (data) {
                res.json(data);
            })
        } else {
            res.send(500);
        }
    });

    app.get('/api/getLastWindReading', function (req, res) {
        if (wind.ready) {
            wind.getLastReading(function (data) {
                res.json(data);
            })
        } else {
            res.send(500);
        }
    });

    app.put('/api/node', function (req, res) {

        nodes.putNode(req.body, function(err, data){
            if(err){
                res.status(500).end();
            } else {
                io.emit('nodeData', data);
                res.status(200).end();
            }
        });

    });

    app.get('/api/node/:limit', function (req, res, next) {

        var limit = parseInt(req.params.limit);

        if(_.isNaN(limit)){
            res.send(500);
            return;
        } else {
            nodes.getNodeReadings(limit, function (data) {
                res.json(data);
            })
        }

    });

    app.get('/ping', function (req, res) {
        res.status(200).end();
    });

    return;

};

