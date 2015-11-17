var _ = require('underscore');
var moment = require('moment');
// moment.lang('de');

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

  seneca.add({ role:'eventStore', cmd:'list' }, function (args, callback) {
    var eventEntry = seneca.make('event');

    eventEntry.list$({sort$:{timestamp: -1}}, function(err, entries){
      entries = _.sortBy(entries, function(entry){ return entry.timestamp; });
      entries.reverse();
      entries = entries.map(function(entry) {
        entry.timeText = moment(entry.timestamp).locale('de').fromNow();
        return entry;
      });

      callback(err, {entries: entries});
    });
  });

  next();
};

exports.register.attributes = {
  name: 'eventStorePlugin',
  version: '1.0.0'
};
