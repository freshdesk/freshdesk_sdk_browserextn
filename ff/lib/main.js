var pageMod = require("sdk/page-mod");
var req = require("sdk/request");

var pgmodWorker = null;

var page = pageMod.PageMod({
  include: [
    /.*\.freshdesk.com\/helpdesk\/tickets\/[0-9]+/,
    /.*\.freshdesk.com\/users\/[0-9]+/,
    /.*\.freshmarketr.com\/helpdesk\/tickets\/[0-9]+/,
    /.*\.freshmarketr.com\/users\/[0-9]+/
  ],
  contentScriptFile: './code.js',
  onAttach: function(worker) {
    pgmodWorker = worker;
    sendLocalRequest();
  }
});

function sendLocalRequest() {
  console.log('Sending ajax request...');
  var oReq = req.Request({
    url: 'http://localhost:10001/',
    overrideMimeType: 'text/plain',
    onComplete: handleLocalPlugRequest
  });
  oReq.get();
  console.log('Sent ajax request...');
}

function handleLocalPlugRequest(res) {
  console.log('Request executed...');
  // console.log(res.text);
  if(pgmodWorker != null) {
    pgmodWorker.port.emit('insertPlug', res.text);
  }
  else {
    console.log('Worker is null!!');
  }
  console.log('Sent to content-script...');
}
