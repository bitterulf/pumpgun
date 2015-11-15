var assert = require("assert");
var Browser = require('zombie');
Browser.waitDuration = '30s';

var host = 'localhost';
var port = 8080;
var site = 'http://'+host+':'+port;

describe('webserver', function(){
  this.timeout(100000);
  before(function(done) {
    var that = this;
    that.seneca = require('seneca')();
    require('../server.js')({host: host, port: port, test: true, seneca: that.seneca}, function(err, server) {
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
      this.browser.assert.text('#_jl_f6c90cad1d1406ba a[href="http://localhost/rc/clk?jk=f6c90cad1d1406ba"] h2', 'Betreuer (m/w)');
      this.browser.assert.text('#_jl_f6c90cad1d1406ba div.company', 'UNIONHILFSWERK');
      this.browser.assert.text('#_jl_f6c90cad1d1406ba div.location', 'Berlin');
      this.browser.assert.elements('.job', 10);
    });
  })
  describe('stepstone test rendering', function(){
    before(function(done) {
      this.browser.visit('/test/stepstone', done);
    });
    it('should display scraped stepstone content', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('h1'), 'stepstone');
      this.browser.assert.text('#_3538945 a[href="http://localhost/stellenangebote--Fachinformatiker-in-Systemintegration-Berlin-Integrate-It-Netzwerke-GmbH--3538945-inline.html?isHJ=false&isHJR=false&ssaPOP=13&ssaPOR=13"] h2', 'Fachinformatiker/in - Systemintegration');
      this.browser.assert.text('#_3538945 div.company', 'Integrate-It Netzwerke GmbH');
      this.browser.assert.text('#_3538945 div.location', 'Berlin');
      this.browser.assert.elements('.job', 25);
    });
  })
  describe('job test', function(){
    before(function(done) {
      this.browser.visit('/test/job', done);
    });
    it('should return fine', function() {
      assert.ok(this.browser.success);
    });
  })
});
