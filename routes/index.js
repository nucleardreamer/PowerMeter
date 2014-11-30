var express = require('express');
var _ = require('lodash');
var router = express.Router();
var path = require('path');
var wind = require(path.join('..','lib','wind_scrape'));

var incomingResults = {};

router.get('/', function(req, res) {
	res.render('index', { title: 'Power Meter' });
});

router.get('/wind', function(req, res){

});

router.put('/node', function(req, res){
	console.log('req', req.body, req.params);
	
	var data = JSON.parse(req.body);

	console.log(data);
	if(_.isUndefined(incomingResults[data.nodeNumber])){
		incomingResults[data.nodeNumber] = {
			readings: []
		}
	}
	incomingResults[data.nodeNumber].readings.push(data.reading);

	res.status(200).end();

});

router.get('/node', function(req, res){
	res.status(200).json(incomingResults);
});

router.get('/ping', function(req, res){
	res.status(200).end();
});


module.exports = router;
