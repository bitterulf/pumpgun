exports.register = function (server, options, next) {
  var seneca = options.seneca;

  seneca.add({ role:'diff', cmd:'compare' }, function (args, callback) {
    var entries = args.entries;
    var jobDump = seneca.make('jobDump');
    jobDump.list$({sort$:{timestamp:1}}, function(err,list){
      if (!list.length) {
        jobDump.entries = entries;
        jobDump.save$(function(err, entity){
          callback(null, {
            add: entries,
            remove: []
          });
        })
      }
      else {
        var oldEntries = list[0].entries;
        var add = [];
        var remove = [];

        jobDump.entries = entries;
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
