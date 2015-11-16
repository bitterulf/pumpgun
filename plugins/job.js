exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'job', cmd:'scrape' }, function (args, callback) {
    seneca.act({
      role:'scrape', cmd:'indeed', city: options.city
    }, function (err, indeedResult) {
      seneca.act({
        role:'scrape', cmd:'stepstone', city: options.city
      }, function (err, stepstoneResult) {
        callback(null, {
          indeed: indeedResult.entries,
          stepstone: stepstoneResult.entries
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
