const MongoClient = require("mongodb").MonogoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useUnifiedTopology: true}, (err , client) => {
    console.log('connected');

    const dbName ='my project';
    const db = client.db(dbName);

    var name = 'user' + Math.floor(Math.random() * 10000);
    var email = name + "@emony"

    var collection = db.collection('customers');
    var doc = {name , email};
    collection.insertOne(doc, {w: 1} ,function(err, result){
        console.log('document insert ');
    });

    var customers = db
    .collection('customers')
    .find()
    .toArray(function(err, docs){
        console.log('collections:' ,docs);

        client.close()
    })

})