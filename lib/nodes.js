var _ = require('lodash');

var Nodes = function(){
    var _this = this;
    _this.allNodes = {};
};

Nodes.prototype.putNode = function(data, cb){
    var _this = this,
        newNode = false;

    if (_.isUndefined(_this.allNodes[data.nodeNumber])) {
        newNode = true;
        _this.allNodes[data.nodeNumber] = {
            readings: []
        };
    }

    if (_this.allNodes[data.nodeNumber].readings.length >= 500) {
        _this.allNodes[data.nodeNumber].readings = _.last(_this.allNodes[data.nodeNumber].readings, 499)
    }

    _this.allNodes[data.nodeNumber].readings.push(data.reading);

    cb(false, {
        node: data.nodeNumber,
        reading: data.reading,
        newNode: newNode
    });

};

Nodes.prototype.getNodeReadings = function(limit, cb){
    var _this = this;
    if(_.size(_this.allNodes)){
        var allNodesToReturn = _.cloneDeep(_this.allNodes);
        _.forEach(allNodesToReturn, function (item, k) {
            allNodesToReturn[k].readings = _.last(allNodesToReturn[k].readings, limit);
        });
        cb(allNodesToReturn);
    } else {
        cb({});
    }
};


module.exports = Nodes;