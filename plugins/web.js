var seneca = require('seneca')();
var client = seneca.client();

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      client.act({ role:'request', cmd:'index' }, function (err, result) {
        reply.view(result.view, result.context);
      });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'webPlugin',
  version: '1.0.0'
};
