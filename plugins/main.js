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

  seneca.listen();

  next();
};

exports.register.attributes = {
  name: 'mainPlugin',
  version: '1.0.0'
};
