var FreshplugDeveloperExtension =  Class.create({
  initialize: function() {
    this.extnVersion = chrome.runtime.getManifest().version,
    _that = this;

    //listens content script's message -- to EXECUTE_SCRIPT
    this.addMessageListener(this);
  },

  addMessageListener: function(_that) {
    chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
      switch(message.type) {
        case "EXTN_EXECUTE_SCRIPT":
          //call to SDK 
          _that.executeRequestAtSDK(_that, message);
          break;
      }
    });
  },

  //sends requests to SDK and its response to contentscript.js
  executeRequestAtSDK: function(sel, message) {
    var xhr = new XMLHttpRequest(),
        _that = this;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {

          if(xhr.status == 200) {
              console.log("Sending response to contentscript");
              sel.chromeSendMessageToTab(tabs[0].id, {type: "EXTN_BIND_RESPONSE", res: xhr.responseText});
          }

          else { // non 200 response!
            var resp = JSON.parse(xhr.responseText),
                msg = 'Response status: ' + xhr.status + "\n";

            msg += "Response message:\n" + resp['message'];
            
            // create notification:
            chrome.notifications.create(
              null, // notification id -- may need to set it up when we show up more error messages
              {
                type: 'basic',
                iconUrl: 'img/32.png',
                title: 'Freshdesk Dev Extension: Error!',
                message: msg
              },
              function(notificationId) {
                console.log('Notification created with id: ' + notificationId);
              }
            );
          }
        }
      }

      //sends request to local SDK server
      xhr.open("POST", "http://localhost:10001/plug/", true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
      xhr.setRequestHeader('FAExtnVersion', _that.extnVersion); // to check extn's version compatibility at SDK server.

      var jsonParams = {};
      jsonParams['url'] = tabs[0].url;
      jsonParams['pageParams'] = message.pageParams;
      jsonParams['page'] = message.page;
      jsonParams['requester'] = message.requester;
      jsonParams['current_user'] = message.current_user;
      xhr.send(JSON.stringify(jsonParams));
      return xhr.responseText;
    });
  },

  chromeSendMessageToTab: function(tab, data) {
    chrome.tabs.sendMessage(tab, data, function(result){});
  }

});

var freshplugDeveloperExtension = new FreshplugDeveloperExtension();
