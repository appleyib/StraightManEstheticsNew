var expect = require('chai').expect;
var request = require("request");


describe('test get all users list', function() {
    it('', function() {
        var r = request("http://localhost:3000/users", function(error, response, body) {
            expect(body).to.be.equal([{
                "userName": "admin",
                "gender": "male",
                "introduction": "admin!"
            }, {
                "userName": "testUser1",
                "gender": "male",
                "introduction": "Hi, I am testUser1!"
            }, {
                "userName": "testUser2",
                "gender": "male",
                "introduction": "Hi, I am testUser2 hahaha!"
            }, {
                "userName": "testUser3",
                "gender": "female",
                "introduction": "Hi, I am testUser3 lalala!"
            }]);
        });
    });
});

describe('test search user', function() {
    it('', function() {
        var r = request("http://localhost:3000/users?userName=testUser1", function(error, response, body) {
            expect(body).to.be.equal([{
                "userName": "admin",
                "gender": "male",
                "introduction": "admin!"
            }, {
                "userName": "testUser1",
                "gender": "male",
                "introduction": "Hi, I am testUser1!"
            }, {
                "userName": "testUser2",
                "gender": "male",
                "introduction": "Hi, I am testUser2 hahaha!"
            }, {
                "userName": "testUser3",
                "gender": "female",
                "introduction": "successfully change intro!"
            }]);
        });
    });
});


describe('test delete user', function() {
    it('', function() {
    	var r = request.delete("http://localhost:3000/repopulating");
        r = request.delete("http://localhost:3000/deleteUser?userName=testUser3");
        r = request("http://localhost:3000/users?userName=testUser3", function(error, response, body) {
            expect(body).to.be.equal("Success");
        });
    });
});


describe('test double delete same user', function() {
    it('', function() {
    	var r = request.delete("http://localhost:3000/repopulating");
        r = request.delete("http://localhost:3000/deleteUser?userName=testUser3");
        r = request("http://localhost:3000/users?userName=testUser3", function(error, response, body) {
            expect(body).to.be.equal("Error: no such user");
        });
    });
});


describe('test repopulating', function() {

    it('', function() {
        var result;
        var r = request.delete("http://localhost:3000/repopulating");
        result = request("http://localhost:3000/users", function(error, response, body) {
            expect(body).to.be.equal([]);
        });
    });
});
