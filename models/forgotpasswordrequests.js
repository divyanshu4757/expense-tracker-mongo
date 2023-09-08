const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotSchema = new Schema({

  isActive:{
    type:Boolean,
    
  },
  
  userId:{
    type:String,
    required:true,
  }
})



module.exports = mongoose.model('ForgotPassword',forgotSchema);

