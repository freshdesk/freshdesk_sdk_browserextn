/* Copyright (C) 2016 Freshdesk, Inc.
This source code is a part of the Freshdesk SDK and is covered by the our license terms. For details about this license, please read the LICENSE.txt which is bundled with this source code. */

var browserExtnVerPH = document.getElementById('browser-extn-version');
var browserExtnVer = chrome.runtime.getManifest().version;

var sdkVerPH = document.getElementById('sdk-version');
var sdkCompatMsgPH = document.getElementById('sdk-compat-msg');

browserExtnVerPH.innerHTML = 'Extn. Version: ' + browserExtnVer;

function getSdkVersion() {
  jQuery.ajax(
    {
      url:'http://localhost:10001/version.json',
      dataType: 'json'
    }
  )
  .done(
    function(data) {
      jQuery('#sdk-version').addClass('sdk-version');
      sdkVerPH.innerHTML = 'SDK Version: ' + data['sdk-version'];
    }
  )
  .fail(
    function() {
      jQuery('#sdk-version').removeClass('sdk-version');
      sdkVerPH.innerHTML = '';
    }
  );
}

function sdkVersionCompatCheck() {
  jQuery.ajax(
    {
      url: 'http://localhost:10001/version/compatible/' + browserExtnVer
    }
  )
  .done(
    function(data) {
      sdkCompatMsgPH.innerHTML =  "<div class='success-wrap'><img src='img/smiley-happy.svg' class='svg'></div>"+
                                  "<div class='status'>All Good! Happy Coding!</div>";
      jQuery('.validation-msg').addClass('success');
    }
  )
  .fail(
    function(jqXHR, textStatus) {
      var msg, link;
      if(jqXHR.readyState == 4) {
        msg = "<div class='status'>SDK is not compatible. <br> Please update your SDK to use with this extension.</div>";
      }
      else if(jqXHR.readyState == 0) {
        msg = "<div class='status'>Please start your SDK server.</div>";
      }
      sdkCompatMsgPH.innerHTML = "<div class='error-wrap'><img src='img/notice-o.svg' class='svg'></div>"+msg;
      jQuery('.validation-msg').addClass('error');
    }
  );
}

// First call:
getSdkVersion();
sdkVersionCompatCheck();

// Check every n seconds:
var SDK_CHK_TIME_INTERVAL = 300000;
setInterval(getSdkVersion, SDK_CHK_TIME_INTERVAL);
setInterval(sdkVersionCompatCheck, SDK_CHK_TIME_INTERVAL);