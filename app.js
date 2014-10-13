require('newrelic');

var express = require('express'),
	app = express();

var routes = require('./routes')(app);

var server = app.listen(process.env.PORT || 8000, function() {
	console.log('Listening on port %d', server.address().port);
});