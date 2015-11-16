exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'diff', cmd:'compare' }, function (args, callback) {
    seneca.act({ role:'diff', cmd:'compareProvider', provider: 'p1', entries: args.provider.p1}, function (err, result) {
      callback(null, result);
    })
  });

  seneca.add({ role:'diff', cmd:'compareProvider' }, function (args, callback) {
    var entries = args.entries;
    var jobDump = seneca.make('jobDump');

    jobDump.list$({provider: args.provider, sort$:{timestamp: -1}}, function(err,list){
      if (!list.length) {
        jobDump.timestamp = Date.now();
        jobDump.entries = entries;
        jobDump.provider = args.provider;
        jobDump.save$(function(err, entity){
          callback(null, {
            add: [],
            remove: []
          });
        })
      }
      else {
        var diff = function(array1, array2) {
          var result = [];
          array1.forEach(function(entry) {
            var findings = array2.filter(function(e) { return e.id == entry.id; });
            if (findings.length < 1) {
              result.push(entry);
            }
          });
          return result;
        };

        var oldEntries = list[0].entries;
        var add = diff(entries, oldEntries);
        var remove = diff(oldEntries, entries);

        jobDump.timestamp = Date.now();
        jobDump.entries = entries;
        jobDump.provider = args.provider;
        jobDump.save$(function(err, entity){
          callback(null, {
            add: add,
            remove: remove
          });
        })
      }
    })
  })

  next();
};

exports.register.attributes = {
  name: 'diffPlugin',
  version: '1.0.0'
};
