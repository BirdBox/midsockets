var Utils = require('../utils');
var App = require('../app');

/*
 * SockjsClient
 */

module.exports = (function(){

  function SockjsClient(options) {
    if (!options.url) { 
      throw new Error("midsockets requires a connection url"); 
    }
    SockjsClient.__super__.constructor.apply(this, arguments);
    var _this = this;
    this.sock = new SockJS(options.url);
    this._buffer = [];  
    this.sock.onopen = function(){
      console.info('midsockets.Apps.SockjsClient :: opened '+options.url);
      _this._buffer.forEach(function(message){
        _this.sock.send(message);
      });
      _this._buffer = [];
    };
    this.sock.onclose = function(){ console.info('midsockets.Apps.SockjsClient :: closed '+options.url); };
    this.sock.onmessage = function(e){ 
      if (!e || e.type !== "message") { console.error("strange message",e); return; }
      try {
        var parsed = JSON.parse(e.data);
        _this._in(parsed, {});
      } catch(err) {
        console.error("couldn't parse message",err)
      }
    };
    this._out.last(function(req,res,next){
      if (_this.sock.readyState===1) { // open
        _this.sock.send(JSON.stringify(req));
      } else {
        _this._buffer.push(JSON.stringify(req));
      }
    });
    return this;
  };

  Utils.extends(SockjsClient, App);

  return SockjsClient;

})();