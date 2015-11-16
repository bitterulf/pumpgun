if (!process.argv[2] || !process.argv[3]) {
  process.exit();
}

var seneca = require('seneca')();

seneca.use('jsonfile-store', {
  folder:'data'
});

require('./server.js')({city: process.argv[3], host: 'localhost', port: process.argv[2], seneca: seneca, interval: 60, test: true}, function(err) {
  setInterval(function(){
    seneca.act({role:'trigger', cmd:'run'}, function (err, result) {
      console.log('triggered');
    });
  }, 60 * 1000);
  if (err) {
    throw err;
  }
});
