var seneca = require('seneca')();

exports.register = function (server, options, next) {
  var seneca = require('seneca')();

  seneca.add({ role:'request', cmd:'index' }, function (args, callback) {
    callback(null, {
      view: 'default',
      context: {
        title: 'welcome'
      }
    })
  })

  seneca.add({ role:'scrape', cmd:'indeed' }, function (args, callback) {
    require('../provider/indeed.js').list(args.city, args.limit, function(err, result) {
      callback(null, {
        entries: result
      });
    }, args.testUrl);
  })

  seneca.add({ role:'scrape', cmd:'stepstone' }, function (args, callback) {
    require('../provider/stepstone.js').list(args.city, args.limit, function(err, result) {
      callback(null, {
        entries: result
      });
    }, args.testUrl);
  })

  seneca.listen();

  next();
};

exports.register.attributes = {
  name: 'mainPlugin',
  version: '1.0.0'
};
