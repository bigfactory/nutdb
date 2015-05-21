

var store = require('./store/index');
var collection = require('./collection');

module.exports = Database;

function Database(path){
    this.store = null;
    this.collections = {};

    if(path === 'memory'){
        this.store = new store.Memory();
    }
    else{
        this.store = new store.Disk(path);
    }
}

Database.prototype.collection = function(name){
    var instance;

    if(this.collections[name]){
        return this.collections[name];
    }

    instance = new collection(name, this);
    this.collections[name] = instance;

    return instance;
};

Database.prototype._getStore = function(){
    return this.store;
};

Database.prototype._notify = function(type, instance){

};