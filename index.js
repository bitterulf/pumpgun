if (!process.argv[2]) {
  process.exit();
}

var seneca = require('seneca')();

require('./server.js')({city: process.argv[2], host: 'localhost', port: 80, seneca: seneca}, function(err) {
  if (err) {
    throw err;
  }
});
