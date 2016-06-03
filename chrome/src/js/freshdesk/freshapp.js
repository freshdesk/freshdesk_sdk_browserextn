/* Copyright (C) 2016 Freshdesk, Inc.
This source code is a part of the Fresh SDK and is covered by the our license terms. For details about this license, please read the LICENSE.txt which is bundled with this source code. */

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