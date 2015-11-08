var addGood = function(server, cb) {
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
  }, cb);
};

var addVision = function(server, cb) {
  server.register(require('vision'), function(err) {
    server.views({
      engines: { jade: require('jade') },
      path: __dirname + '/templates',
      compileOptions: {
        pretty: true
      }
    });
    cb(err);
  });
};

module.exports  = function server (config, cb) {
  var Hapi = require('hapi');

  var server = new Hapi.Server();
  server.connection({
    host: config.host,
    port: config.port
  });

  addGood(server, function (err) {
    if (err) {
      return cb(err);
    }

    addVision(server, function(err) {
      if (err) {
        return cb(err);
      }

      server.register(require('./plugins/main.js'), function(err) {
        if (err) {
          return cb(err);
        }
        server.start(function(err) {
          if (err) {
            return cb(err);
          }
          cb(null);
        });
      });
    });
  });
};
