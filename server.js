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
  var Path = require('path');
  var Hapi = require('hapi');
  var Inert = require('inert');

  var server = new Hapi.Server({
    connections: {
      routes: {
        files: {
          relativeTo: Path.join(__dirname, 'public')
        }
      }
    }
  });

  server.connection({
    host: config.host,
    port: config.port
  });

  var seneca = require('seneca')();

  server.register([
    {register: require('good'), options: options.good },
    {register: require('vision'), options: {} },
    {register: require('inert'), options: {} },
    {register: require('./plugins/web.js'), options: {seneca: seneca, city: config.city, port: config.port} },
    {register: require('./plugins/scraper.js'), options: {seneca: seneca} },
    {register: require('./plugins/main.js'), options: {seneca: seneca} },
    {register: require('./plugins/job.js'), options: {seneca: seneca, city: config.city, port: config.port} },
    {register: require('./plugins/diff.js'), options: {seneca: seneca} }
  ], function(err) {
    if (err) {
      return cb(err);
    }
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true
        }
      }
    });
    server.views(options.views);
    server.start(function(err) {
      if (err) {
        return cb(err);
      }
      cb(null);
    });
  });

};
