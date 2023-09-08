const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadSchema = new Schema({

  url:{
    type:String,
    required:true,
  },
 userId:{
    type:String,
    required:true,
 }
})



module.exports = mongoose.model('Download',downloadSchema);
