exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'job', cmd:'scrape' }, function (args, callback) {
    callback(null, {});
  })

  next();
};

exports.register.attributes = {
  name: 'jobPlugin',
  version: '1.0.0'
};
