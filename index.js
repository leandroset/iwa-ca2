
const express = require('express')
const app = express()
const fs= require('fs')
const axios = require('axios');
const route = express.Router()
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { backendUrl, mongodbUrl } = require('./utils/util');
const mongodb = require("./utils/model");

mongodb.mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("database Connected!");
  })
  .catch(err => {
    console.log("Unable to connect !", err);
    process.exit();
  });
const Users = mongodb.Users;
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

//this line is required to parse the request body
app.use(express.json())
app.use(cors())

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use(express.static('assets'));


app.get('/', (req, res) => {
    axios.get(backendUrl+"/user/list")
        .then(function(response){
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

})

app.get('/update-user/', (req, res) => {
    axios.get(backendUrl+'/update-user/:username')
        .then(function(response){
            //console.log(finds)
           res.render('update_user', {username: req.query.username,
            age: req.query.age,
            fullname: req.query.fullname,
            password: req.query.password})
            
        })
        .catch(err =>{
            res.send(err);
        })

})





app.get('/update-user/:username', (req, res)=> {

      
      const username = req.params.username

      //check if it exists    
      Users.find({username:username}).then(data => {
          if(data){
                  res.send(data[0])     
          }else{ 
              res.status(404).send({ message : "No User With username ["+ username+"]"})
              
          }
      })
      .catch(err => {
          res.status(500).send({
          message:
              err.message || " Error Occured"
          });
      });

})



/* Create - POST method */
app.post('/user/add', (req, res) => {

  
// //get the existing user data


  //get data

  const user = req.body

  // Finding Out if blog with given BlogId Already Exists
  Users.find({username: user.username})
  .then(users => {
      // looking for blog data if already exists
      if (users && users.length) {
          return res.status(409).send({error: true, msg: 'username already exist'})
      }else{
          let newUser =new Users(user)
          newUser
          .save(newUser)
          .then(data => {
              res.redirect('/');

          })
          .catch(err => {
          res.status(500).send({
              message:
              err.message || "Some error occurred while creating the User."
          });
          });
      }


  })
  .catch(err => {
      res.status(500).send({
      message:
          err.message || "Some error occurred while retrieving User."
      });
  });

})




/* Read - GET method */
app.get('/user/list', (req, res) => {
    
 
    // fetching All the users from database
   Users.find()
   .then(data => {
       res.send(data)
   })
   .catch(err => {
       res.status(500).send({
       message:
           err.message || "Some error occurred while retrieving All users."
       });
   });

})



// app.get('/update/:username', (req,res) =>{

//     //get the username from url
//     const username = req.params.username
//     //get the update data
   
//     const existUsers = getUserData()
//     //check if the username exist or not       
//     const findExist = existUsers.find( user => user.username === username )
//     if (!findExist) {
//         return res.status(409).send({error: true, msg: 'username not exist'})
//     }
//     else{
//         res.send(findExist);

//     }
// })



/* Update - Patch method */
app.patch('/user/update/:username', (req, res) => {
  
    
      //get the id from url
  const username = req.params.username
  //get the update data
  const user = req.body
    Users.update({username:username},user).then(data=>{
            res.send(data)
        }).catch(err=>{
            return res.status(409).send({error: true, msg: 'user id not exist'})
        })
    // res.redirect('/')
    
   
})

/* util functions */
//read the user data from json file
const saveUserData = (data) => {
    
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('users.json', stringifyData)
}
//get the user data from json file
const getUserData = () => {
    const jsonData = fs.readFileSync('users.json')
    return JSON.parse(jsonData)    
}

//routing
app.get('/add-user', (req, res) =>{
    res.render('add_user')
})



let port = process.env.PORT || 3000
//configure the server port
app.listen(port, () => {
    console.log('Server runs on port 3000')
})