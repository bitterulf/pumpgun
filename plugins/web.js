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
      client.act({
        role:'scrape', cmd:'indeed', city: options.city, limit: 1, testUrl: 'http://localhost/examples/indeed.html'
      }, function (err, result) {
        result.title = 'indeed';
        reply.view('jobList', result);
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/stepstone',
    handler: function (request, reply) {
      client.act({
        role:'scrape', cmd:'stepstone', city: options.city, limit: 1, testUrl: 'http://localhost/examples/stepstone.html'
      }, function (err, result) {
        result.title = 'stepstone';
        reply.view('jobList', result);
      });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'webPlugin',
  version: '1.0.0'
};
