var unirest = require('unirest');

if (!process.argv[2] || !process.argv[3]) {
  process.exit();
}

var seneca = require('seneca')({ timeout:99999 });

seneca.use('jsonfile-store', {
  folder:'data'
});

var test = false;

var scraping = false;

var scrape = function(cb) {
  require('./provider/stepstone.js').list(process.argv[3], 160, process.argv[2], test, function(err, result) {
    unirest.post('http://localhost:'+process.argv[2]+'/api/push').header('Accept', 'application/json').type('json').send(
      { provider: { stepstone: result } }
    ).end(function (reponse) {
      var result = reponse.body;
      var timestamp = Date.now();
      console.log('REZ', result);
      console.log('REZADD', result.add);
      result.add.forEach(function(addEntry) {
        seneca.act({ role:'eventStore', cmd:'save', type: 'add', data: addEntry, timestamp: timestamp }, function (err, result) {
        });
      });
      result.remove.forEach(function(removeEntry) {
        seneca.act({ role:'eventStore', cmd:'save', type: 'remove', data: removeEntry, timestamp: timestamp }, function (err, result) {
        });
      });
      cb(null, result);
    });
  });
};

require('./server.js')({city: process.argv[3], host: 'localhost', port: process.argv[2], seneca: seneca, interval: 60 * 15, test: test}, function(err) {
  if (!test) {
    setInterval(function(){
      if (!scraping) {
        scraping = true;
        scrape(function(err, result) {
          scraping = false;
          console.log('scraped');
        });
      }
      else {
        console.log('allready scraping');
      }
    }, 60 * 1000);
    scraping = true;
    scrape(function(err, result) {
      scraping = false;
      console.log('scraped');
    });
  }
  if (err) {
    throw err;
  }
});
