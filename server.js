var options = {
  good: {
    opsInterval: 1000,
    reporters: [{
      reporter: require('good-console'),
      events: {
        // ops: '*',
        log: '*',
        response: '*'
      }
    }]
  },
  views: {
    engines: { jade: require('jade') },
    path: __dirname + '/templates',
    compileOptions: {
      pretty: true
    }
  }
};

module.exports  = function server (config, cb) {
  var Hapi = require('hapi');

  var server = new Hapi.Server();
  server.connection({
    host: config.host,
    port: config.port
  });

  server.register([
    {register: require('good'), options: options.good },
    {register: require('vision'), options: {} },
    {register: require('./plugins/web.js'), options: {} },
    {register: require('./plugins/main.js'), options: {} }
  ], function(err) {
    if (err) {
      return cb(err);
    }
    server.views(options.views);
    server.start(function(err) {
      if (err) {
        return cb(err);
      }
      cb(null);
    });
  });

};
