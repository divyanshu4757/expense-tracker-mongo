const express = require("express");

const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require('./models/userInfo');


const routes = require("./routes/routes.js");

const premiumRoutes = require("./routes/premiumRoutes.js");
 const forgotRoutes = require("./routes/forgotpassword.js");



app.use(cors());



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(routes);
app.use(premiumRoutes);
app.use(forgotRoutes);









mongoose.connect('demo')
.then(()=>{
  console.log('connected to database');
app.listen(5000);


})
.catch(err => {
  console.log(err);
});