exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
      reply.view('default', {
        title: 'welcome'
      });
    }
  });

  next();
};

exports.register.attributes = {
  name: 'mainPlugin',
  version: '1.0.0'
};
