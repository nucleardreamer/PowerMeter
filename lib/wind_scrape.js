var Wind = function(){
    var _this = this;
    _this.mainUrl = 'http://transmission.bpa.gov/business/operations/Wind/twndbspt.txt';
    _this.init();
}

Wind.prototype.init = function(){
    var _this = this;
    console.log(_this.mainUrl)
}

module.exports = new Wind();