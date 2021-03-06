var assert = require("assert");
var Browser = require('zombie');
Browser.waitDuration = '30s';

var unirest = require('unirest');

var host = 'localhost';
var port = 8080;
var site = 'http://'+host+':'+port;

describe('webserver', function(){
  this.timeout(100000);
  before(function(done) {
    var that = this;
    that.seneca = require('seneca')();
    require('../server.js')({host: host, port: port, test: true, seneca: that.seneca, interval: 1}, function(err, server) {
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
  describe('job api', function(){
    it('should return 10 indeed and 25 stepstone results', function(done) {
      unirest.get(site+'/api/jobs').header('Accept', 'application/json').send().end(function (result) {
        assert.equal(result.body.indeed.length, 10);
        assert.equal(result.body.stepstone.length, 25);
        done();
      });
    });
  })
  describe('compare api', function(){
    it('first push should not give any changes back', function(done) {
      unirest.post(site+'/api/push').header('Accept', 'application/json').type('json').send(
        { provider: { p1: [{id: 'a1'}]} }
      ).end(function (result) {
        assert.equal(result.body.add.length, 0);
        assert.equal(result.body.remove.length, 0);
        done()
      });
    });
    it('second push should give a remove and a add back', function(done) {
      unirest.post(site+'/api/push').header('Accept', 'application/json').type('json').send(
        { provider: { p1: [{id: 'a2'}]} }
      ).end(function (result) {
        assert.equal(result.body.add.length, 1);
        assert.equal(result.body.add[0].id, 'a2');
        assert.equal(result.body.remove.length, 1);
        assert.equal(result.body.remove[0].id, 'a1');
        done()
      });
    })
    it('third push should give a single remove back', function(done) {
      unirest.post(site+'/api/push').header('Accept', 'application/json').type('json').send(
        { provider: { p1: [] } }
      ).end(function (result) {
        assert.equal(result.body.add.length, 0);
        assert.equal(result.body.remove.length, 1);
        assert.equal(result.body.remove[0].id, 'a2');
        done()
      });
    })
    it('fourth push should give a single add back even if a second provider is pushed', function(done) {
      unirest.post(site+'/api/push').header('Accept', 'application/json').type('json').send(
        { provider: { p1: [{id: 'a3'}], p2: [{id: 'b1'}] } }
      ).end(function (result) {
        assert.equal(result.body.add.length, 1);
        assert.equal(result.body.add[0].id, 'a3');
        assert.equal(result.body.remove.length, 0);
        done()
      });
    })
    it('fifth push should give add and a remove back for the second provider', function(done) {
      unirest.post(site+'/api/push').header('Accept', 'application/json').type('json').send(
        { provider: { p1: [{id: 'a3'}], p2: [{id: 'b2'}] } }
      ).end(function (result) {
        assert.equal(result.body.add.length, 1);
        assert.equal(result.body.add[0].id, 'b2');
        assert.equal(result.body.remove.length, 1);
        assert.equal(result.body.remove[0].id, 'b1');
        done()
      });
    })
  })
  describe('logs', function(){
    before(function(done) {
      this.browser.visit('/logs', done);
    });
    it('should be filled', function() {
      assert.ok(this.browser.success);
      assert.equal(this.browser.text('h1'), 'logs');
      this.browser.assert.elements('.logLine', 1);
      assert.equal(this.browser.text('.logLine'), '<scrape> indeed: 10, stepstone: 25');
    });
  })
});
