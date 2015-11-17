if (!process.argv[2] || !process.argv[3]) {
  process.exit();
}

var seneca = require('seneca')({ timeout:99999 });

seneca.use('jsonfile-store', {
  folder:'data'
});

var test = false;

var scrape = function(cb) {
  require('./provider/stepstone.js').list(process.argv[3], 160, process.argv[2], test, function(err, result) {
    cb(null, {
      entries: result
    });
  });
};

require('./server.js')({city: process.argv[3], host: 'localhost', port: process.argv[2], seneca: seneca, interval: 60 * 15, test: test}, function(err) {
  scrape(function(err, result) {
    console.log('scraped', result.entries.length);
  });
  if (false && !test) {
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
