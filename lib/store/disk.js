

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var jf = require('jsonfile');

module.exports = Store;

function Store(rootpath){
    this.rootpath = rootpath;
    mkdirp.sync(rootpath);
}

Store.prototype.get = function(name){
    var dbfile = path.join(this.rootpath, name+'.json');
    var table = {
        count: 0,
        data: []
    };
    var content;

    try{
        content = jf.readFileSync(dbfile);
    }catch(e){
        content = null;
    }
    

    if(content && content.data){
        return content
    }

    jf.writeFileSync(dbfile, table);
    
    return table;
};

Store.prototype.save = function(name, table){
    var dbfile = path.join(this.rootpath, name+'.json');
    jf.writeFileSync(dbfile, table);
};