var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runboos";

var zjl_mongodb_Show  = function (callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db('runboos');
        callback(db,dbo);
    });
}

module.exports = zjl_mongodb_Show;