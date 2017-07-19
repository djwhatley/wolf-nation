const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI;

module.exports = {
    connect: (callback) => {
        MongoClient.connect(url, (err, db) => {
            callback(err, db);
        });
    }
}