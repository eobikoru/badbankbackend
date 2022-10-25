const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
var cookieParser = require('cookie-parser');

var dal = require("./dal.js");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "build")));
app.use(cookieParser());
const admin = require('firebase-admin');
const credentials = require("./badbankFirebase.json");
const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})


app.post('/signup/:email/:password',async (req, res) => {

  const user = {
    email : req.body.email,
    password : req.body.password,
  }
  const userResponse = await admin.auth().createUser({
    email : user.email,
    password : user.password,
    emailVerified:false,
    disabled: false
  });

res.json(userResponse)
});



//serving the landing  page

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "build", "index.html"));
});


// create users
app.get("/account/create/:name/:email/:password", (req, res) => {
  dal
    .create(req.params.name, req.params.email, req.params.password)
    .then((user) => {
      console.log(user);
      res.send(user);
    });
});


 //GET ALL USERS
app.get("/account/all", (req, res) => {
  dal.all().then((docs) => {
    console.log(docs);
    res.send(docs);
  });
});

// update
app.put("/account/update/:email/:amount", (req, res) => {
  dal.update(req.params.email , req.params.amount)
  .then((dl) => {
    console.log(dl);
    res.send(dl);
  });
});




app.get("/account/:email", (req, res) => {
  dal.find(req.params.email)
  .then((dull) => {
    console.log(dull);
    res.send(dull);
  });
});



//login
// app.get("/account/login/:email/:password", (req, res) => {
//   res.send({
//     email: req.params.email,
//     password: req.params.password,
//   });
// });





app.listen(PORT, () => console.log(`app running on port ${PORT}`));
