var expect = require('chai').expect;
var inventoryAllocator = require('../inventory-allocator.js');
var allocator = new inventoryAllocator();
// console.log(allocator.calculatePossibleShipments(
//           { apple: 5, banana: 5, orange: 5 }, { owd: { apple: 4, orange: 5 }, dm: { banana: 5, orange: 5, apple: 5} }
//       ));
describe('Testing', function() {
  describe('Check setup', function() {
    it('Should pass base case if setup is correct', function(done) {
      expect([]).to.deep.equal(allocator.calculatePossibleShipments({}, {}));
      done();
    });
  });

  describe('Check to make sure if availability exists or not', function() {
    it('Should pass base case if setup is correct', function(done) {
      expect([]).to.deep.equal(allocator.calculatePossibleShipments(
          {apple: 5, banana: 5, orange: 5},
          {owd: {apple: 1, orange: 4}, dm: {banana: 5, orange: 5}}
      ));
      done();
    });
  });
  describe('Check a few base cases', function() {
    it('Should pass exact one case solution', function(done) {
      expect([{owd: {apple: 1}}]).to.deep.equal(allocator.calculatePossibleShipments({apple: 1}, {owd: {apple: 1}})[0]);
      expect(1).to.equal(allocator.calculatePossibleShipments({apple: 1}, {owd: {apple: 1}}).length);
      done();
    });
    it('Should pass no solution case', function(done) {
      expect(0).to.equal(allocator.calculatePossibleShipments({apple: 1}, {owd: {apple: 0}}).length);
      expect([]).to.deep.equal(allocator.calculatePossibleShipments({apple: 1}, {owd: {apple: 0}}));
      expect([]).to.deep.equal(allocator.calculatePossibleShipments({apple: 5, banana: 5, orange: 5}, {owd: {apple: 1, orange: 4}, dm: {banana: 5, orange: 5}}));
      done();
    });
    it('Should pass exact basic split case', function(done) {
      expect([{owd: {apple: 5}}, {dm: {apple: 5}}]).to.deep.equal(allocator.calculatePossibleShipments({apple: 10}, {owd: {apple: 5}, dm: {apple: 5}})[0]);
      expect(1).to.equal(allocator.calculatePossibleShipments({apple: 10}, {owd: {apple: 5}, dm: {apple: 5}}).length);
      done();
    });
    it('Should provide two suggestions if an item can go in either warehouse', function(done) {
      expect([{owd: {apple: 5}}, {dm: {banana: 5, orange: 5}}]).to.deep.equal(allocator.calculatePossibleShipments({apple: 5, banana: 5, orange: 5}, {owd: {apple: 5, orange: 10}, dm: {banana: 5, orange: 10}})[0]);
      expect([{owd: {apple: 5, orange: 5}}, {dm: {banana: 5}}]).to.deep.equal(allocator.calculatePossibleShipments({apple: 5, banana: 5, orange: 5}, {owd: {apple: 5, orange: 10}, dm: {banana: 5, orange: 10}})[1]);
      expect(2).to.equal(allocator.calculatePossibleShipments({apple: 5, banana: 5, orange: 5}, {owd: {apple: 5, orange: 10}, dm: {banana: 5, orange: 10}}).length);
      done();
    });
  });
  describe('Check all solution cases and split cases seperately and together', function() {
    it('Should find all solutions for case with more than 3 solutions', function(done) {
      expect([[{owd: {apple: 5}}, {dm: {banana: 5, orange: 5}}],
              [{owd: {orange: 5}}, {dm: {banana: 5, apple: 5}}],
              [{owd: {apple: 5, orange: 5}}, {dm: {banana: 5}}],
              [{dm: {banana: 5, orange: 5, apple: 5}}]]).to.deep.equal(
              allocator.calculatePossibleShipments(
                {apple: 5, banana: 5, orange: 5}, {owd: {apple: 5, orange: 5},
                dm: {banana: 5, orange: 5, apple: 5}}
                ));
      expect(4).to.deep.equal(
              allocator.calculatePossibleShipments(
                {apple: 5, banana: 5, orange: 5}, {owd: {apple: 5, orange: 5},
                dm: {banana: 5, orange: 5, apple: 5}}
                ).length);
      done();
    });
    it('Should find all solutions for case with splits and more than 1 solution', function(done) {
      expect([[{owd: {apple: 4}}, {dm: {banana: 5, orange: 5, apple: 1}}],
              [{owd: {apple: 4, orange: 5}}, {dm: {banana: 5, apple: 1}}],
             ]).to.deep.equal(
              allocator.calculatePossibleShipments(
               {apple: 5, banana: 5, orange: 5},
               {owd: {apple: 4, orange: 5},
                dm: {banana: 5, orange: 5, apple: 4},
                }
                ));
      expect(2).to.deep.equal(
              allocator.calculatePossibleShipments(
                {apple: 5, banana: 5, orange: 5},
                {owd: {apple: 4, orange: 5},
                  dm: {banana: 5, orange: 5, apple: 4}}
                ).length);
      done();
    });
  });

});


