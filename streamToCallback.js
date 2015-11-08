var stream = require('stream-wrapper');
var Throttle = require('stream-throttle').Throttle;

module.exports = function(rs, cb) {
  var result = '';
  var counter = 0;
  var ws = stream.writable(function(chunk, enc, callback) {
    counter++;
    console.log(counter);
    result += chunk.toString();
    callback();
  });

  rs.pipe(new Throttle({rate: 10000})).pipe(ws);

  ws.on('finish', function() {
    cb(null, result);
  });

  ws.on('error', function(err) {
    cb(err);
  });
};
