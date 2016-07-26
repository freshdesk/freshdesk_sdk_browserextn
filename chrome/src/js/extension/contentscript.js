/* Copyright (C) 2016 Freshdesk, Inc.
This source code is a part of the Freshdesk SDK and is covered by the our license terms. For details about this license, please read the LICENSE.txt which is bundled with this source code. */

jQuery.fn.onAvailable = function(fn){
  var sel = this.selector,
      pollingTime = 50,
      timer;
  if (this.length > 0) {
    //callback when placeholder div becomes available
    fn.call(this);
  }
  else {
    //waits and polls to check availability of placeholder div, then callsback.
    timer = setInterval(function(){
      if (jQuery(sel).length > 0) {
        fn.call(jQuery(sel));
        clearInterval(timer);
      }
    }, pollingTime); // 50 milliseconds!
  }
};


var ContentScript = Class.create({
  initialize: function() {
    this.EXTN_DEV_PARAMS = "EXTN_DEV_PARAMS";
    var _that = this;

    //receives message from extension background.js -- following is used for injecting app code in helpkit
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
      switch(message.type) {
        case "EXTN_BIND_RESPONSE":
          jQuery("#fa-dev-pholder").onAvailable(function() {
            //this injects the app code in helpkit's fa-dev-pholder and make it to visible state
            var messageContent = JSON.parse(message.res);
            localStorage.setItem("fa_appName", messageContent['appName']);
            jQuery(this).html(messageContent['content']).show();
          });
          break;
      }
    });

    //listens window messages from helpkit 
    jQuery(window).on("message.extn", this.receiveExtnMessage.bindAsEventListener(this));
  },

  // message receiver from helpkit
  receiveExtnMessage: function(evt) {
    var event =  evt.originalEvent;
    if (event.source != window) {
      return;
    }
    
    // receives message from Helpkit about its readiness for appcode to inject
    if(event.data.type && (event.data.type == "FA_INITIATE")) {
      console.log("INITIATES");
      this.getDomHelperData();
    }

    // Receives message from helpkit and triggers request to Background
    if (event.data.type && (event.data.type == this.EXTN_DEV_PARAMS)) {
      chrome.extension.sendMessage({ type: "EXTN_EXECUTE_SCRIPT",
                                     pageParams: event.data.pageParams,
                                     page: event.data.page,
                                     requester: event.data.requester,
                                     current_user: event.data.current_user
                                   }, function(result){});
    }
  },

  //get DomHelperData 
  getDomHelperData: function() {
    var _that = this,
        FA_GET_DOM_DATA = "FA_GET_DOM_DATA";

    jQuery(document).off(FA_GET_DOM_DATA);
    jQuery(document).on(FA_GET_DOM_DATA, function(ev) {
      var script = document.createElement('script');
      jQuery(script).attr("id", "injectedScript");
      jQuery(script).append(document.createTextNode('('+ _that.getDetails +')();'));
      (document.body || document.head || document.documentElement).appendChild(script);
    });
    jQuery(document).trigger(FA_GET_DOM_DATA);
  },

  //gets the required data such as dom_helper_data, page_type, requester, current_user for liquid parsing
  getDetails: function() {
    window.postMessage({ type: "EXTN_DEV_PARAMS",
                         pageParams: dom_helper_data,
                         page: page_type,
                         requester: requester,
                         current_user: current_user
                       }, "*");
    var flag = false;
    jQuery(window).on("message", function(event) {
      var evt= event.originalEvent,
        msg_type = evt.data.type;
      if(msg_type == "EXTN_SDK_DEV"){
        if(!flag){
          flag = true;
          eval(evt.data.callback);
          jQuery(document).trigger("dom_helper_loaded");
        }
      }
    });
  }
});
var contentScript = new ContentScript();
