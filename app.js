process.env.TZ = 'America/Los_Angeles';

require('newrelic');
var event = require('events');
var ee = new event.EventEmitter();

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var _wind = require(path.join(__dirname,'lib','wind_scrape'));
var wind = new _wind();

var routes = require('./routes/index')(ee, wind);

var app = express();
var server = require('http').Server(app);

var io = require(path.join(__dirname,'lib','io'))(server, wind, ee);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var incomingResults = {};

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Power Meter'
    });
});

app.get('/dashboard', function (req, res) {
    res.render('dashboard', {
        title: 'Power Meter'
    });
});

app.get('/api/getAllWindReadings', function (req, res) {
    if (wind.ready) {
        wind.getWindData(function (data) {
            res.json(data);
        })
    } else {
        res.send(501);
    }
});

app.get('/api/getLastWindReading', function (req, res) {
    if (wind.ready) {
        wind.getLastReading(function (data) {
            res.json(data);
        })
    } else {
        res.send(501);
    }
});

app.put('/api/node', function (req, res) {
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

app.get('/api/node/:lastNum', function (req, res) {
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

app.get('/ping', function (req, res) {
    res.status(200).end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var debug = require('debug')('power-meter');

server.listen(process.env.PORT || 8000, function() {
    debug('Express server listening on port ' + (process.env.PORT || 8000));
});

