exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'eventStore', cmd:'save' }, function (args, callback) {
    var eventEntry = seneca.make('event');
    eventEntry.data = args.data;
    eventEntry.type = args.type;
    eventEntry.timestamp = args.timestamp;

    eventEntry.save$(function(err, entity){
      callback(err, entity);
    });
  });

  next();
};

exports.register.attributes = {
  name: 'eventStorePlugin',
  version: '1.0.0'
};
