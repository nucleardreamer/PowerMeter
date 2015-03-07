var RealtimeNodes = function(){
    var _this = this;
    _this.nodes = {
        0: {connected: false, stats: null },
        1: {connected: false, stats: null },
        2: {connected: false, stats: null },
        3: {connected: false, stats: null }
    };
    _this.prefix = 'node-id';
    $(document).ready(function(){
        _this.init(_this.nodes);
    });

};

RealtimeNodes.prototype.init = function(nodes){
    var _this = this;

    _.forEach(nodes, function(node, k){
        var nodeDom = $('['+_this.prefix+'="'+k+'"]');
        if(node.connected){
            nodeDom.addClass('connected');
        } else {
            nodeDom.removeClass('connected');
        }
        nodeDom.find('.title').text(nodeNames[k]);
        if(!_.isNull(node.stats)) {
            nodeDom.find('.stats')
                .find('.arch').text(String.format('{0} ({1})', node.stats.os, node.stats.arch)).end()
                .find('.mem').text(String.format('{0}/{1}', bytesToSize(node.stats.mem.total - node.stats.mem.free), bytesToSize(node.stats.mem.total))).end()
                .find('.uptime').text(moment.duration(node.stats.uptime, 'seconds').humanize())
        }

    })
};

RealtimeNodes.prototype.update = function(nodes){
    var _this = this;
    _.forEach(nodes, function(node){
        var cached = _this.nodes[node.nodeNum];
        cached.connected = true;
        cached.stats = node
    });
    _this.init(_this.nodes);
};

RealtimeNodes.prototype.offline = function(node){
    var _this = this;
    $('['+_this.prefix+'="'+node+'"]').removeClass('connected');
    _this.nodes[node] = {connected: false, stats: null }
};
