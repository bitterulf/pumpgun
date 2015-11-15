exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'scrape', cmd:'indeed' }, function (args, callback) {
    require('../provider/indeed.js').list(args.city, args.limit, options.test, function(err, result) {
      callback(null, {
        entries: result
      });
    });
  })

  seneca.add({ role:'scrape', cmd:'stepstone' }, function (args, callback) {
    require('../provider/stepstone.js').list(args.city, args.limit, options.test, function(err, result) {
      callback(null, {
        entries: result
      });
    });
  })

  next();
};

exports.register.attributes = {
  name: 'scraperPlugin',
  version: '1.0.0'
};
