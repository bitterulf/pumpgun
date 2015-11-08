if (!process.argv[2]) {
  process.exit();
}

require('./server.js')({city: process.argv[2], host: 'localhost', port: 80}, function(err) {
  if (err) {
    throw err;
  }
});
