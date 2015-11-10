exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'request', cmd:'index' }, function (args, callback) {
    callback(null, {
      view: 'default',
      context: {
        title: 'welcome'
      }
    })
  })

  next();
};

exports.register.attributes = {
  name: 'mainPlugin',
  version: '1.0.0'
};
