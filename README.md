# NutDB

NutDB is a light weight database build with json file and similar interface with mongodb.

## Install

```
npm install nutdb
```

## Usage

### Initialize

```
var nut = require('nutdb');

//in memory 
var db = nut('memory');

//file base
var db = nut('/tmp/data/');

```

### Colletion

```
var db = nut('memory');
var collection = db.collection('user');

collection.find({}, functino(err, result){
    console.log(result);
});
```

### Insert

```
var db = nut('memory');
var collection = db.collection('documents');

collection.insert([
    {a : 1}, {a : 2}, {a : 3}
], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
});
```

### Find

```
var db = nut('memory');
var collection = db.collection('user');

collection.find({
    name: 'John'
}, functino(err, users){
    console.log(users.length);
});

//find one
collection.findOne({
    name: 'John'
}, functino(err, user){
    console.log(user.name);
});
```

### Update

```
var db = nut('memory');
var collection = db.collection('documents');

collection.insert([
    {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
], function(err, result) {
    collection.update({ a : 2 }
        , { $set: { b : 3 } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(2, result.result.n);
        assert.equal(1, result.result.nModified);
    });  
});
```

### Remove

```
var db = nut('memory');
var collection = db.collection('documents');

collection.insert([
    {a : 2, b: 1}, {a : 2, b: 3}, {a : 3}
], function(err, result) {
    collection.remove({ a : 2 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(2, result.result.n);
        collection.find({}, function(err, result){
            assert.equal(1, result.length);
        });
    });
});
```