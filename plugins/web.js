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

  server.route({
    method: 'GET',
    path:'/indeed',
    handler: function (request, reply) {
      require('../provider/indeed.js').list(options.city, 1, function(err, result) {
        reply(result);
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/stepstone',
    handler: function (request, reply) {
      require('../provider/stepstone.js').list(options.city, 1, function(err, result) {
        reply(result);
      });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'webPlugin',
  version: '1.0.0'
};
