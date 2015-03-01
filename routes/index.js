var express = require('express');
var _ = require('lodash');
var router = express.Router();
var path = require('path');
var wind = require(path.join('..','lib','wind_scrape'));

var incomingResults = {};

router.get('/', function(req, res) {
	res.render('index', {
		title: 'Power Meter'
	});
});

router.get('/api/getAllWindReadings', function(req, res){
	if(wind.ready){
		wind.getWindData(function(data){
			res.json(data);
		})
	} else {
		res.send(501);
	}
});

router.get('/api/getLastWindReading', function(req, res){
	if(wind.ready){
		wind.getLastReading(function(data){
			res.json(data);
		})
	} else {
		res.send(501);
	}
});


router.put('/node', function(req, res){
	console.log('req', req.body, req.params);

	var data = req.body;

	console.log(data);
	if(_.isUndefined(incomingResults[data.nodeNumber])){
		incomingResults[data.nodeNumber] = {
			readings: []
		}
	}
	if(incomingResults[data.nodeNumber].readings.length >= 500){
		incomingResults[data.nodeNumber].readings = _.last(incomingResults[data.nodeNumber].readings, 499)
	}
	incomingResults[data.nodeNumber].readings.push(data.reading);

	res.status(200).end();

});

router.get('/node/:lastNum', function(req, res){
	var lastNum = parseInt(req.params.lastNum);
	if(lastNum == 0){
		res.status(200).json(incomingResults);
	} else {
		var incomingResultsLimited = _.cloneDeep(incomingResults);
		_.forEach(incomingResultsLimited, function(item, k){
			console.log('item', item, k);
			incomingResultsLimited[k].readings = _.last(incomingResultsLimited[k].readings, lastNum);
		});
		res.status(200).json(incomingResultsLimited);
	}

});

router.get('/ping', function(req, res){
	res.status(200).end();
});


module.exports = router;
