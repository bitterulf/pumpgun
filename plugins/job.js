exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'job', cmd:'scrape' }, function (args, callback) {
    seneca.act({
      role:'scrape', cmd:'indeed', city: options.city, limit: 1,
      testUrl: 'http://localhost:'+options.port+'/examples/indeed.html'
    }, function (err, indeedResult) {
      seneca.act({
        role:'scrape', cmd:'stepstone', city: options.city, limit: 1,
        testUrl: 'http://localhost:'+options.port+'/examples/stepstone.html'
      }, function (err, stepstoneResult) {
        callback(null, {
          entries: indeedResult.entries.concat(stepstoneResult.entries)
        });
      });
    });
  })

  next();
};

exports.register.attributes = {
  name: 'jobPlugin',
  version: '1.0.0'
};
