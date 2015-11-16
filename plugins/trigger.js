exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'trigger', cmd:'run' }, function (args, callback) {;
    var triggerEntry = seneca.make('trigger');
    triggerEntry.list$({}, function(err, entries){
      entries = entries.filter(function(entry) { return +entry.timestamp > Date.now() - options.interval * 1000; });

      if (entries.length) {
        callback(null, {
          result: 'not run'
        });
      }
      else {
        seneca.act({role:'trigger', cmd:'execute'}, function(err, result) {
          callback(null, {
            result: 'run'
          });
        });
      }
    });
  });

  seneca.add({ role:'trigger', cmd:'execute' }, function (args, callback) {;
    var triggerEntry = seneca.make('trigger');
    triggerEntry.timestamp = Date.now();

    triggerEntry.save$(function(err, entity){
      callback(null);
    });
  });

  seneca.add({ role:'trigger', cmd:'report' }, function (args, callback) {
    var triggerEntry = seneca.make('trigger');
    triggerEntry.list$({sort$:{timestamp: -1}}, function(err, entries){
      callback(err, {entries: entries});
    });
  });

  next();
};

exports.register.attributes = {
  name: 'triggerPlugin',
  version: '1.0.0'
};
