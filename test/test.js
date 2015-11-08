process.env.NODE_ENV = 'test';

var assert = require("assert");
var Browser = require('zombie');

describe('webserver', function(){
  before(function(done) {
    var that = this;
    require('../server.js')({host: 'localhost', port: 8080}, function(err, server) {
      that.server = server;
      that.browser = new Browser({site: 'http://localhost:8080'});
      done();
    });
  });

  before(function(done) {
    this.browser.visit('/', done);
  });

  describe('index page', function(){
    it('should display welcome as heading', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('h1'), 'welcome');
    });
  })
});
