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
    path:'/test/{provider}',
    handler: function (request, reply) {
      var provider = request.params.provider;
      client.act({
        role:'scrape', cmd: provider, city: options.city, limit: 1
      }, function (err, result) {
        result.title = provider;
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
