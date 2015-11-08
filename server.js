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

      return reply('<h1>welcome</h1>');
    }
  });

  server.start(function(err) {
    if (err) {
      return cb(err);
    }
    cb(null);
  });
};
