/* Copyright (C) 2016 Freshdesk, Inc.
This source code is a part of the Freshdesk SDK and is covered by the our license terms. For details about this license, please read the LICENSE.txt which is bundled with this source code. */

var LocalTesting = Class.create({
  run: function(callback){
    var appName = localStorage.getItem("fa_appName");
    var execCallback = callback +
    `
    Freshapp.exec({
      'content' : ${appName},
      'appName' : '${appName}'
    })
    `
    var msg = {
      type: "EXTN_SDK_DEV",
      callback: execCallback
    }
    window.postMessage(msg, "*");
  }
});

var Localtesting = new LocalTesting();
