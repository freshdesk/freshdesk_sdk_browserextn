/* Copyright (C) 2016 Freshdesk, Inc.
This source code is a part of the Freshdesk SDK and is covered by the our license terms. For details about this license, please read the LICENSE.txt which is bundled with this source code. */

var browserExtnVerPH = document.getElementById('browser-extn-version');
var browserExtnVer = chrome.runtime.getManifest().version;

var sdkVerPH = document.getElementById('sdk-version');
var sdkCompatMsgPH = document.getElementById('sdk-compat-msg');

var versionUrl = 'http://ws.freshdev.io/sdk/version.json';

browserExtnVerPH.innerHTML = 'Extn. Version: ' + browserExtnVer + '<span id="browser-extn-new-version" class="bold"></span>';

function getSdkVersion() {
  jQuery.ajax(
    {
      url:'http://localhost:10001/version.json',
      dataType: 'json'
    }
  )
  .done(
    function(data) {
      sdkVerPH.innerHTML = 'SDK Version: ' + data['sdk-version'] + '<span id="sdk-new-version" class="bold"></span>';
      jQuery.ajax(
        {
          url: versionUrl,
          dataType: 'json'
        }
      )
      .done(
        function(versionData) {
          var sdkVersionData = versionData['sdkCli'];
          var extVersionData = versionData['sdkChromeExtn'];
          if(isGreaterThan(data['sdk-version'], sdkVersionData['version'])){
            var sdkNewVer = document.getElementById('sdk-new-version');
            var sdkCommand = document.getElementById('sdk-command');
            sdkNewVer.innerHTML = " - New version available";
            sdkCommand.innerHTML = sdkVersionData['cmd'] +
            "<div id='copy-cmd' class='update-action'>Copy command</div>";
            copyCommand(sdkVersionData);
          }
          if(isGreaterThan(browserExtnVer, extVersionData['version'])) {
            var browserExtnNewVer = document.getElementById('browser-extn-new-version');
            var browserExtnDownload = document.getElementById('extn-download');
            browserExtnNewVer.innerHTML = ' - New version available';
            browserExtnDownload.innerHTML = `<a href=${extVersionData['dl']} target='_blank' class='update-action link'>Update</a>`;
          }
        }
      )
      .fail()
    }
  )
  .fail(
    function() {
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
        msg = "<div class='status'>SDK and extension are not compatible.<br> Please Update.</div>";
      }
      else if(jqXHR.readyState == 0) {
        msg = "<div class='status'>Please start your SDK server.</div>";
      }
      sdkCompatMsgPH.innerHTML = "<div class='error-wrap'><img src='img/notice-o.svg' class='svg'></div>"+msg;
      jQuery('.validation-msg').addClass('error');
    }
  );
}

function copyCommand(versionData) {
  jQuery("#copy-cmd").on('click', function(){
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = versionData['cmd'];
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
  });
}

function isGreaterThan(oldVersion, newVersion){
	var oldV = oldVersion.split(".");
  var oMajor = oldV[0];
  var oMinor = oldV[1];
  var oPatch = oldV[2];

  var newV = newVersion.split(".");
	var nMajor = newV[0];
  var nMinor = newV[1];
  var nPatch = newV[2];

  if(nMajor > oMajor) {
  	return true;
  }
  else if(nMajor == oMajor) {
  	if(nMinor > oMinor) {
    	return true;
    }
    else if(nMinor == oMinor) {
    	if(nPatch > oPatch) {
      	return true;
      }
    }
  }
  return false;
}

// First call:
getSdkVersion();
sdkVersionCompatCheck();

// Check every n seconds:
var SDK_CHK_TIME_INTERVAL = 300000;
setInterval(getSdkVersion, SDK_CHK_TIME_INTERVAL);
setInterval(sdkVersionCompatCheck, SDK_CHK_TIME_INTERVAL);