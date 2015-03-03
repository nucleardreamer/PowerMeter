process.env.TZ = 'America/Los_Angeles';
require('newrelic');

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);

var Wind = require(path.join(__dirname,'lib','wind_scrape'));
var wind = new Wind();

var Io = require(path.join(__dirname,'lib','io'));
var io = new Io(server, wind);

var Nodes = require(path.join(__dirname,'lib','nodes'));
var nodes = new Nodes();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require(path.join(__dirname, 'routes', 'index'))(app, wind, nodes, io);

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

