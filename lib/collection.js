

module.exports = Collection;

function Collection(name ,db){
    this.name = name;
    this.db = db;
}

Collection.prototype.find = function(condition, callback){
    var store = this.db._getStore();
    var table = store.get(this.name);
    var items = table.data;
    var result = [];
    var keys = Object.keys(condition);

    if(!keys.length){
        callback(null, items);
        return;
    }

    items.forEach(function(item){
        var key;
        for(var i = 0, len = keys.length; i < len; i++){
            key = keys[i];
            if(item[key] != condition[key]){
                return;
            }
        }
        result.push(item);
    });

    callback(null, result);

};

Collection.prototype.findOne = function(condition, callback){
    this.find(condition, function(err, result){
        callback(err, result[0]);
    });
};

Collection.prototype.insert = function(items, callback){

    var store = this.db._getStore();
    var table = store.get(this.name);
    var result = {
        ok: 1,
        n: 0
    };
    var ops = [];

    for(var i = 0, len = items.length; i < len; i++){
        table.count++;
        result.n++;
        items[i]._id = table.count;
        ops.push(items[i]);
        table.data.push(items[i]);
    }

    store.save(this.name, table);

    callback(null, {
        result: result,
        ops: ops
    });
};

Collection.prototype.update = function(condition, opts, callback){
    var store = this.db._getStore();
    var table = store.get(this.name);
    var items = table.data;
    var result = {
        "ok": 1,
        "nModified": 0,
        "n": 0
    };

    var conditionKeys = Object.keys(condition);
    var $set = opts.$set;
    var $setKeys = Object.keys($set);
    var toUpsert;

    items.forEach(function(item){
        var needModify = false;
        var modified = false;
        var key;

        if(!conditionKeys.length){
            needModify = true;
        }
        else{
            for(var i = 0, len = conditionKeys.length; i < len; i++){
                key = conditionKeys[i];
                if(item[key] != condition[key]){
                    return;
                }
            }
            needModify = true;
        }

        if(needModify){
            result.n++;
        }

        $setKeys.forEach(function(key){
            if(item[key] != $set[key]){
                item[key] = $set[key];
                modified = true;
            }
        });

        if(modified){
            result.nModified++;
        }
    });

    if(result.n == 0 && opts.upsert){
        toUpsert = condition || {};
        $setKeys.forEach(function(key){
            toUpsert[key] = $set[key];
        });

        this.insert([toUpsert], function(err, result){
            callback(err, result);
        });
    }
    else{
        store.save(this.name, table);
        callback(null, {result: result});
    }

};

Collection.prototype.remove = function(condition, callback){
    var store = this.db._getStore();
    var table = store.get(this.name);
    var items = table.data;
    var tmp = [];

    var result = {
        "ok": 1,
        "n": 0
    };

    var conditionKeys = Object.keys(condition);

    items.forEach(function(item){
        var needRemove = false;
        var key, $set, $setKeys;

        if(!conditionKeys.length){
            needRemove = true;
        }
        else{
            for(var i = 0, len = conditionKeys.length; i < len; i++){
                key = conditionKeys[i];
                if(item[key] != condition[key]){
                    tmp.push(item);
                    return;
                }
            }
            needRemove = true;
        }

        if(!needRemove){
            tmp.push(item);
            return;
        }

        result.n++;
    });

    table.data = tmp;
    
    store.save(this.name, table);

    callback(null, {result: result});
};

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}