const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({

  description:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  }
  ,
  amount:{
    type:String,
    required:true,
  },
  userId:{
    type:String,
    required:true,
  }
})



module.exports = mongoose.model('Expense',expenseSchema);








