exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'trigger', cmd:'run' }, function (args, callback) {
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
            result: result
          });
        });
      }
    });
  });

  seneca.add({ role:'trigger', cmd:'execute' }, function (args, callback) {
    var triggerEntry = seneca.make('trigger');
    var timestamp = Date.now();
    triggerEntry.timestamp = timestamp;

    triggerEntry.save$(function(err, entity){
      seneca.act({ role:'job', cmd:'scrape' }, function (err, result) {
        seneca.act({ role:'diff', cmd:'compare', provider: result }, function (err, result) {
          // here it should save the add and remove elements
          callback(null, result);
          result.add.forEach(function(addEntry) {
            seneca.act({ role:'eventStore', cmd:'save', type: 'add', data: addEntry, timestamp: timestamp }, function (err, result) {
            });
          });
          result.remove.forEach(function(removeEntry) {
            seneca.act({ role:'eventStore', cmd:'save', type: 'remove', data: removeEntry, timestamp: timestamp }, function (err, result) {
            });
          });
        });
      });
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
