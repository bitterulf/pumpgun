var Xray = require('x-ray');
var x = Xray();

var streamToCallback = require('../streamToCallback.js');

var counter = 1;

module.exports = {
  list: function(city, limit, port, test, cb) {
    var url = 'http://www.stepstone.de/5/ergebnisliste.html?ws='+city;

    if (test) {
      url = 'http://localhost:'+port+'/examples/stepstone'+counter+'.html';
      if (counter < 2) {
        counter++;
      }
    }

    var xstream = x(url, '#resultlist .joblisting', [{
      id: '.job_title a@id',
      title: '.job_info .job_title a span',
      image: '.company_logo img@src',
      company: '.company_name span',
      location: '.job_location_info span',
      date: '.job_date_added time',
      url: '.job_title a@href'
    }])
    .paginate('#navigation_next_link@href')
    .limit(limit)
    .write();

    streamToCallback(xstream, function(err, result) {
      result = JSON
        .parse(result)
        .map(function(obj){
          obj.id = obj.id.replace('jobtitle-', '');
          obj.provider = 'stepstone';
          obj.location = obj.location.split(' und ').join(', ').split(', ');
          return obj;
        });
      cb(err, result)
    });
  }
};
