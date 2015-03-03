var CronJob = require('cron').CronJob,
    _ = require('lodash');

var Cron = function(wind, io, nodes){
    var _this = this;

    _this.running = [];

    _this.jobs = [
        {
            cronTime: '*/5 * * * *',
            onTick: function() {
                console.log('running wind update');
                wind.init(function(data){
                    io.emit('windData', data);
                });
            },
            start: false,
            timeZone: "America/Los_Angeles"
        }
        //{
        //    cronTime: '00 30 11 * * 1-5',
        //    onTick: function() {
        //        // spawn fake data child process
        //        var childProcess = require('child_process'),
        //            faker;
        //
        //        faker = childProcess.exec('node workers/run_fake_node_reporting.js', function (error, stdout, stderr) {
        //            if (error) {
        //                console.log(error.stack);
        //                console.log('Error code: '+error.code);
        //                console.log('Signal received: '+error.signal);
        //            }
        //            console.log('Child Process STDOUT: '+stdout);
        //            console.log('Child Process STDERR: '+stderr);
        //        });
        //
        //        faker.on('exit', function (code) {
        //            console.log('Child process exited with exit code '+code);
        //        });
        //    },
        //    start: false,
        //    timeZone: "America/Los_Angeles"
        //}
    ];


    _this.runJobs();

};

Cron.prototype.runJobs = function(){
    var _this = this;

    _.forEach(_this.jobs, function(opts){
        var job = new CronJob(opts);
        job.start();
        _this.running.push(job);
    });
};

module.exports = Cron;






