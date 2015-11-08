require('./server.js')({host: 'localhost', port: 80}, function(err) {
  if (err) {
    throw err;
  }
});
