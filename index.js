if (!process.argv[2] || !process.argv[3]) {
  process.exit();
}

var seneca = require('seneca')();

require('./server.js')({city: process.argv[3], host: 'localhost', port: process.argv[2], seneca: seneca, interval: 1, test: true}, function(err) {
  if (err) {
    throw err;
  }
});
