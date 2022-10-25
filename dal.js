const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
let db = null;

//connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  console.log("connected");
  db = client.db("myproject");
});

// create users
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}


//all users
function all() {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({})
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

// update - deposit/withdraw amount
function update(email, amount){   
        const user =  db.collection('users')
        .findOne(
          {email}
        )

console.log(user,00);


    console.log(email ,amount);
      // const customers = db
      //     .collection('users')            
      //     .findOneAndUpdate(
      //         {email: email},
      //         { $inc: { balance: amount}},
      //         { returnOriginal: false },
      //         function (err, documents) {
      //             err ? reject(err) : resolve(documents);
      //         }
      //     );            

     
}

function find(email) {
   return new Promise((resolve , reject) => {
     const customers = db 
     .collection('users')
     .findOne({email: email})
     .then((doc) => resolve(doc))
     .catch((err) => reject(err))
   })
}


module.exports = { create, all, find , update };
