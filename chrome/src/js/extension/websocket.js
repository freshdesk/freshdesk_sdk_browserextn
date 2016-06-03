/* Copyright (C) 2016 Freshdesk, Inc.
This source code is a part of the Fresh SDK and is covered by the our license terms. For details about this license, please read the LICENSE.txt which is bundled with this source code. */

var FAWebSocket = Class.create({
  initialize: function() {
    this.ticket_uri = new RegExp(/(https?):\/\/([\w0-9]+\.[\w0-9]+\.([\w]{2,6})(\.[\w]{2,6})?|localhost:3000)?\/helpdesk\/tickets\/[0-9]+/g);
    this.contact_uri = new RegExp(/(https?):\/\/([\w0-9]+\.[\w0-9]+\.([\w]{2,6})(\.[\w]{2,6})?|localhost:3000)?\/contacts\/[0-9]+/g);
    this.timer;
    this.start();
  },

  start: function() {
    var that = this;
    ws = new WebSocket("ws://localhost:10001/notify-change");
    ws.onopen = function(){
      clearInterval(that.timer);
      chrome.browserAction.setBadgeText({text: ''});
      console.log('connected!');
    };
    ws.onmessage = function(e){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.match(that.ticket_uri) || tabs[0].url.match(that.contact_uri)) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    };
    ws.onclose = function(){
      console.log('closed!');
      chrome.browserAction.setBadgeText({text: 'X'});
      //reconnect now
      var pollingTime = 5000;
      clearInterval(that.timer);
      that.timer = setInterval(function() {
        if(!ws || ws.readyState == 3) {
          that.start();
        }
      }, pollingTime);
    };
  }
});

var faWebSocket = new FAWebSocket();
