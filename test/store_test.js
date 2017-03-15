var chai  = require("chai");

var should  = chai.should();
var request = require("request");
var chaiHttp = require('chai-http');
var server = require('../app/app');
chai.use(chaiHttp);
describe("Store APIs", function() {
  describe("List All Stores", function() {
    it("returns status 200", function(done) {
      chai.request(server)
        .get('/stores')
        .end((err, res) => {
           res.should.have.status(200);
           res.body.should.be.a('array');
         done();
      });
    });
    it("returns status 400 if store name filter not exist", function(done) {
     chai.request(server)
       .get('/stores?store_name=gaadadifield')
       .end((err, res) => {
          res.should.have.status(400);
          res.body.length.should.be.eql(0);
        done();
      });
    });
  });
  describe("Get Detail Store", function() {
    it("returns status 200 get detail data", function(done) {
      chai.request(server)
        .get('/stores/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name');
          res.body.should.have.property('latitude');
          res.body.should.have.property('longitude');
          res.body.should.have.property('id').eql(1);
         done();
      });
    });
    it("returns status 400 get detail data", function(done) {
      chai.request(server)
        .get('/stores/99')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.length.should.be.eql(0);
         done();
      });
    });
  });
  describe("POST get nearset Store", function() {
    it("returns status 200 POST data", function(done) {
      var data={
      }
      chai.request(server)
        .post('/stores/nearest')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
         done();
      });
    });
    it("returns status 200 POST data", function(done) {
      var data={
        latitude:"-1.2",
        longitude:"107",
      }
      chai.request(server)
        .post('/stores/nearest')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name');
          res.body.should.have.property('latitude');
          res.body.should.have.property('longitude');
          res.body.should.have.property('id');
         done();
      });
    });

  });
  describe("POST Store", function() {
    it("returns status 400 POST data", function(done) {
      var data={
      }
      chai.request(server)
        .post('/stores')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
         done();
      });
    });
    it("returns status 200 POST data", function(done) {
      var data={
        name:"Testing",
        latitude:"1892838192",
        longitude:"19239182",
      }
      chai.request(server)
        .post('/stores')
        .send(data)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('name');
          res.body.should.have.property('latitude');
          res.body.should.have.property('longitude');
          res.body.should.have.property('id');
         done();
      });
    });

  });
  describe("UPDATE Store", function() {
    it("returns status 400 PUT data because store id not found", function(done) {
      var data={
      }
      chai.request(server)
        .put('/stores/4')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
         done();
      });
    });
    it("returns status 400 PUT data because input data empty", function(done) {
      var data={
      }
      chai.request(server)
        .put('/stores/2')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('errors');
         done();
      });
    });
    it("returns status 200 PUT data", function(done) {
      var data={
        name:"Testing",
        latitude:"1892838192",
        longitude:"19239182",
      }
      chai.request(server)
        .put('/stores/2')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name');
          res.body.should.have.property('latitude');
          res.body.should.have.property('longitude');
          res.body.should.have.property('id');
         done();
      });
    });

  });
  describe("DELETE Store", function() {
    it("returns status 400 because store id not found", function(done) {

      chai.request(server)
        .delete('/stores/10')
        .end((err, res) => {
          res.should.have.status(400);
         done();
      });
    });

    it("returns status 200 delete data", function(done) {
      chai.request(server)
        .delete('/stores/3')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql("success");
         done();
      });
    });

  });
});
