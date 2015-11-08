module.exports  = function server (config, cb) {
  var Hapi = require('hapi');

  var server = new Hapi.Server();
  server.connection({
    host: config.host,
    port: config.port
  });

  server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      reply.view('default', {
        title: 'welcome'
      });
    }
  });

  server.register({
    register: require('good'),
    options: {
      opsInterval: 1000,
      reporters: [{
        reporter: require('good-console'),
        events: {
          // ops: '*',
          log: '*',
          response: '*'
        }
      }]
    }
  }, function (err) {
    if (err) {
      return cb(err);
    }

    server.register(require('vision'), function(err) {
      if (err) {
        return cb(err);
      }

      server.views({
        engines: { jade: require('jade') },
        path: __dirname + '/templates',
        compileOptions: {
          pretty: true
        }
      });

      server.start(function(err) {
        if (err) {
          return cb(err);
        }
        cb(null);
      });
    });
  });
};
