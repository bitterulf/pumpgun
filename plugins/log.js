exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'log', cmd:'add' }, function (args, callback) {;
    var logEntry = seneca.make('log');
    logEntry.timestamp = Date.now();
    logEntry.topic = args.topic;
    logEntry.text = args.text;
    logEntry.save$(function(err, entity){
      callback(err, {entity: entity});
    });
  });

  seneca.add({ role:'log', cmd:'list' }, function (args, callback) {
    var logEntry = seneca.make('log');
    logEntry.list$({sort$:{timestamp: -1}}, function(err, entries){
      callback(err, {entries: entries});
    });
  });

  next();
};

exports.register.attributes = {
  name: 'logPlugin',
  version: '1.0.0'
};
