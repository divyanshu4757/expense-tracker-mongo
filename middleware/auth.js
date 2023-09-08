
const jwt = require('jsonwebtoken');
const User = require('../models/userInfo.js');



exports.authenticate = (req,res,next)=>{

    const token = req.header('Authorization');
   // console.log('token sent' ,token);
    const user = jwt.verify(token ,'myToken');
   // console.log(user);
    const id= user.userId;


    User.findOne({_id:id})
    .then(user=>{
       // console.log(user.id.toString());
      req.userId =user.id.toString();  
        next();
    })
    .catch(err=>{
       res.status(401).json({message:"user not found"})
    })


}


