exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'job', cmd:'scrape' }, function (args, callback) {
    seneca.act({
      role:'scrape', cmd:'indeed', city: options.city
    }, function (err, indeedResult) {
      seneca.act({
        role:'scrape', cmd:'stepstone', city: options.city
      }, function (err, stepstoneResult) {
        seneca.act({
          role:'log', cmd:'add', topic: 'scrape',
          text: 'indeed: '+indeedResult.entries.length+', stepstone: '+stepstoneResult.entries.length
        }, function (err) {
          callback(null, {
            indeed: indeedResult.entries,
            stepstone: stepstoneResult.entries
          });
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
