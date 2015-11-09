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
  describe('indeed test rendering', function(){
    before(function(done) {
      this.browser.visit('/test/indeed', done);
    });
    it('should display scraped indeed content', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('h1'), 'indeed');
      this.browser.assert.text('#jl_f6c90cad1d1406ba a[href="http://localhost/rc/clk?jk=f6c90cad1d1406ba"] h2', 'Betreuer (m/w)');
      this.browser.assert.text('#jl_f6c90cad1d1406ba div.company', 'UNIONHILFSWERK');
      this.browser.assert.text('#jl_f6c90cad1d1406ba div.location', 'Berlin');
      this.browser.assert.elements('.job', 10);
    });
  })
});
