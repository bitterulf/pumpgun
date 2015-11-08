process.env.NODE_ENV = 'test';

var assert = require("assert");
var Browser = require('zombie');

describe('Fake', function(){
  describe('fake action', function(){
    it('should be true', function(){
      assert.equal(true, true);
    })
  })
});
