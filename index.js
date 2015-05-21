var Database = require('./lib/db');


module.exports = function(path){
    return new Database(path);
};