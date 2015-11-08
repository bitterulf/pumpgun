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

      return reply('welcome');
    }
  });

  server.start(function(err) {
    if (err) {
      return cb(err);
    }
    console.log('Server running at:', server.info.uri);
    cb(null);
  });
};
