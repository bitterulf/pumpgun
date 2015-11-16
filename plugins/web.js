exports.register = function (server, options, next) {
  var client = options.seneca.client();

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
    path:'/test/indeed',
    handler: function (request, reply) {
      client.act({
        role:'scrape', cmd:'indeed', city: options.city, limit: 1
      }, function (err, result) {
        result.title = 'indeed';
        reply.view('jobList', result);
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/api/jobs',
    handler: function (request, reply) {
      client.act({
        role:'job', cmd:'scrape', city: options.city, test: 1
      }, function (err, result) {
        reply(result);
      });
    }
  });

  server.route({
    method: 'GET',
    path:'/test/stepstone',
    handler: function (request, reply) {
      client.act({
        role:'scrape', cmd:'stepstone', city: options.city, limit: 1
      }, function (err, result) {
        result.title = 'stepstone';
        reply.view('jobList', result);
      });
    }
  });

  server.route({
    method: 'POST',
    path:'/api/push',
    handler: function (request, reply) {
      client.act({
        role:'diff', cmd:'compare', provider: request.payload.provider
      }, function (err, result) {
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
