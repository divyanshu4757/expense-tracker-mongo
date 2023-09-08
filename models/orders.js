const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

  orderid:{
    type:String,
    required:true,
  },
  status:{
    type:String,
    required:true,
  }
  ,
  userId:{
    type:String,
    required:true,
  }
})



module.exports = mongoose.model('Order',orderSchema);
