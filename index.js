var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 80
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
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
