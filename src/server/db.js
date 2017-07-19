const MongoClient = require('mongodb').MongoClient;

const url = ''; // GET THE MONGODB_URI AND USE IT HERE

module.exports = {
    connect: (callback) => {
        MongoClient.connect(url, (err, db) => {
            callback(err, db);
        });
    }
}

MongoClient.connect(url, (err, db) => {
    
})