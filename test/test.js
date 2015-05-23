var nut = require('../');
var assert = require('assert');
var path = require('path');
var fs = require('fs');


function getDb(){
    return nut('memory');
}

describe('insert', function() {
    it('should return the result', function(done) {
        var db = getDb();
        var collection = db.collection('documents');

        collection.insert([
            {a : 1}, {a : 2}, {a : 3}
        ], function(err, result) {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            done();
        });
    });
});

describe('find', function() {
    it('should return the result', function(done) {
        var db = getDb();
        var collection = db.collection('documents');

        collection.insert([
            {a : 2}, {a : 2, b: 3}, {a : 3}
        ], function(err, result) {
            collection.find({
                a: 2
            }, function(err, result){
                assert.equal(err, null);
                assert.equal(2, result.length);
                done();
            });
        });
    });
});

describe('findOne', function() {
    it('should return the result', function(done) {
        var db = getDb();
        var collection = db.collection('documents');

        collection.insert([
            {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
        ], function(err, result) {
            collection.findOne({
                a: 2
            }, function(err, result){
                assert.equal(err, null);
                assert.equal(2, result.a);
                assert.equal(1, result.b);
                done();
            });
        });
    });
});

describe('update', function() {
    it('should return the result', function(done) {
        var db = getDb();
        var collection = db.collection('documents');

        collection.insert([
            {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
        ], function(err, result) {
            collection.update({ a : 2 }
                , { $set: { b : 3 } }, function(err, result) {
                assert.equal(err, null);
                assert.equal(2, result.result.n);
                assert.equal(1, result.result.nModified);
                done();
            });  
        });
    });
});

describe('upsert', function() {
    it('should return the result', function(done) {
        var db = getDb();
        var collection = db.collection('documents');

        collection.insert([
            {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
        ], function(err, result) {
            collection.update({ 
                a : 4 
            }, { 
                $set: { 
                    b : 5 
                }, 
                upsert: true
            }, function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                collection.findOne({
                    a: 4   
                }, function(err, result){
                    assert.equal(4, result.a);
                    assert.equal(5, result.b);
                });
                done();
            });  
        });
    });
});

describe('remove', function() {
    it('should return the result', function(done) {
        var db = getDb();
        var collection = db.collection('documents');

        collection.insert([
            {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
        ], function(err, result) {
            collection.remove({ a : 2 }, function(err, result) {
                assert.equal(err, null);
                assert.equal(2, result.result.n);
                collection.find({}, function(err, result){
                    assert.equal(1, result.length);
                    done();
                });
            });
        });
    });
});

describe('file base database', function(){
    it('should add & find data exactly', function(done){
        var rootpath = path.join(__dirname, './db');
        var db = nut(rootpath);
        var collection = db.collection('documents');

        collection.remove({}, function(){

            collection.insert([
                {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
            ], function(err, result) {
                collection.update({ a : 2 }
                    , { $set: { b : 3 } }, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(2, result.result.n);
                    assert.equal(1, result.result.nModified);

                    collection.remove({a:2}, function(err, result){
                        collection.find({}, function(err, result){
                            assert.equal(1, result.length);
                            done();
                        });
                    });

                });
            });

        })
    });
});
