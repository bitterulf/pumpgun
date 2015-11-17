if (!process.argv[2] || !process.argv[3]) {
  process.exit();
}

var seneca = require('seneca')({ timeout:99999 });

seneca.use('jsonfile-store', {
  folder:'data'
});

var test = false;

require('./server.js')({city: process.argv[3], host: 'localhost', port: process.argv[2], seneca: seneca, interval: 60 * 15, test: test}, function(err) {
  if (!test) {}
    var t = function() {
      seneca.act({role:'trigger', cmd:'run'}, function (err, result) {
        console.log('triggered');
      });
    };
    setInterval(function(){
      t();
    }, 60 * 1000);
    t();
  }
  if (err) {
    throw err;
  }
});
