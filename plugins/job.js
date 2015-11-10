exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'job', cmd:'scrape' }, function (args, callback) {
    var indeedTestUrl;
    var stepstoneTestUrl;
    if (options.test) {
      indeedTestUrl = 'http://localhost:'+options.port+'/examples/indeed'+options.test+'.html';
    }
    if (options.test) {
      stepstoneTestUrl = 'http://localhost:'+options.port+'/examples/stepstone'+options.test+'.html';
    }
    seneca.act({
      role:'scrape', cmd:'indeed', city: options.city, limit: 1,
      testUrl: indeedTestUrl
    }, function (err, indeedResult) {
      seneca.act({
        role:'scrape', cmd:'stepstone', city: options.city, limit: 1,
        testUrl: stepstoneTestUrl
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
