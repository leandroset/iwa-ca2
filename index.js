
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




let port = process.env.PORT || 3000
//configure the server port
app.listen(port, () => {
    console.log('Server runs on port 3000')
})