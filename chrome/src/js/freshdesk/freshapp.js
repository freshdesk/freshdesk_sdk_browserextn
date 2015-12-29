var FreshApp = Class.create({
  initialize: function(){
  },
  run: function(callback){
    var msg = {
      type: "EXTN_SDK_DEV",
      callback: String(callback)
    }
    window.postMessage(msg, "*");
  }
});

var Freshapp = new FreshApp();