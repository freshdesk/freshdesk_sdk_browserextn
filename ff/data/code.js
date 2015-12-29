
self.port.on('insertPlug', function(message) {
  console.log('Insert plug called...');
  var e = document.getElementById('plug_local_testing');
  if(e != null) {
    e.innerHTML = message;
  }
  else {
    console.log('Local testing not enabled.');
  }
});
