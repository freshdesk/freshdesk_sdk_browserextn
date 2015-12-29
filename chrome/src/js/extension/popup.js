var browserExtnVerPH = document.getElementById('browser-extn-version');
var browserExtnVer = chrome.runtime.getManifest().version;

var sdkVerPH = document.getElementById('sdk-version');
var sdkCompatMsgPH = document.getElementById('sdk-compat-msg');

browserExtnVerPH.innerHTML = browserExtnVer;

function getSdkVersion() {
  jQuery.ajax(
    {
      url:'http://localhost:10001/version.json',
      dataType: 'json'
    }
  )
  .done(
    function(data) {
      sdkVerPH.innerHTML = data['sdk-version'];
    }
  )
  .fail(
    function() {
      sdkVerPH.innerHTML = 'undef';
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
      sdkCompatMsgPH.innerHTML =  "<div class='success-wrap'><img src='img/tick.png'></div>"+
                                  "<div class='status'>All Good! Happy Coding!</div>";
    }
  )
  .fail(
    function(jqXHR, textStatus) {
      var msg, link;
      if(jqXHR.readyState == 4) {
        msg = "<div class='status'>SDK is not compatible! Your SDK version: 2.3. Latest Version: 3.4 <br> Please update your SDK to use with this extension.</div>";
      }
      else if(jqXHR.readyState == 0) {
        msg = "<div class='status'>Please start your SDK Server.</div>";
      }
      sdkCompatMsgPH.innerHTML = "<div class='error-wrap'><img src='img/error.png'></div>"+
                                  msg;
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
