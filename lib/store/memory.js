


module.exports = Store;


function Store(){
    this.pool = {};
}

Store.prototype.get = function(name){
    var pool = this.pool;

    if(pool[name]){
        return pool[name];
    }

    pool[name] = {
        count: 0,
        data: []
    };

    return pool[name];
};

Store.prototype.save = function(name, table){
    var pool = this.pool;
    pool[name] = table;
};