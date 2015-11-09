var Xray = require('x-ray');
var x = Xray();

var streamToCallback = require('../streamToCallback.js');

module.exports = {
  list: function(city, limit, cb, testUrl) {
    var url = 'http://de.indeed.com/Jobs?q=&l='+city;
    if (testUrl) {
      url = testUrl;
    }
    var xstream = x(url, '#resultsCol [data-tn-component="organicJob"] ', [{
      id: '.jobtitle@id',
      title: '.jobtitle a',
      company: '.company span',
      location: '.location span',
      url: '.jobtitle a@href',
      date: '.result-link-bar-container span.date'
    }])
    .paginate('.pagination a:has(.np) @href')
    .limit(limit)
    .write();

    streamToCallback(xstream, function(err, result) {
      result = JSON
        .parse(result)
        .map(function(obj){
          if (!obj.company) {
            obj.company = '';
          }
          obj.company = obj.company.replace('\n', '').trim();
          obj.provider = 'indeed';
          obj.date = (new Date()).toISOString()+' '+obj.date;
          obj.image = '';
          obj.location = obj.location.split(', ');
          return obj;
        });
      cb(err, result)
    });
  }
};
