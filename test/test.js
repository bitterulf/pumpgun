process.env.NODE_ENV = 'test';

var assert = require("assert");
var Browser = require('zombie');

var host = 'localhost';
var port = 8080;
var site = 'http://'+host+':'+port;

describe('webserver', function(){
  before(function(done) {
    var that = this;
    require('../server.js')({host: host, port: port}, function(err, server) {
      that.server = server;
      that.browser = new Browser({site: site});
      done();
    });
  });
  describe('index page', function(){
    before(function(done) {
      this.browser.visit('/', done);
    });
    it('should display welcome as heading', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('h1'), 'welcome');
    });
  }),
  describe('static page', function(){
    before(function(done) {
      this.browser.visit('/test.html', done);
    });
    it('should display test passed', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('div'), 'test passed');
    });
  })
});
