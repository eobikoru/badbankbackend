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


// create users  done

app.get('/account/create/:name/:email/:password', function (req, res) {
   dal.create(req.params.name,req.params.email,req.params.password).
                  then((user) => {
                      console.log(user);
                      res.send(user);            
                  }); 
  // check if account exists
 
});

//login
app.get('/account/login/:email/:password', function (req, res) {
  dal.find(req.params.email).
        then((user) => {
            // if user exists, check password
            
            if(user){
                if (user.password === req.params.password){
                    res.send(user).res.status(200);
                }
                else{
                    res.send('Login failed: wrong password').res.status(401);
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });


//   dal.find(req.params.email).
//       then((user) => {
//  console.log(user);
//           res.send(user);
//           // if user exists, check password
         
//   });
  
});

// find user account
app.get('/account/users/:email', function (req, res) {

  dal.find(req.params.email).
      then((user) => {
          console.log(user);
          res.send(user);
  });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

  dal.findOne(req.params.email).
      then((user) => {
          console.log(user);
          res.send(user);
  });
});
// update - deposit/withdrw amount
app.get('/account/change/:email/:amount', function (req, res) {
  dal.update(req.params.email, req.params.amount).
      then((response) => {
          console.log(response);
          res.send(response);
  });    
});


// all accounts
app.get('/account/all', function (req, res) {
  dal.all().
      then((docs) => {
          console.log(docs);
          res.send(docs);
  });
});






app.listen(PORT, () => console.log(`app running on port ${PORT}`));
