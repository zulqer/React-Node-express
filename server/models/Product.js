var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Product = new mongoose.Schema({
  name: String,
  price: String,
  description:String,
  userId: {
    type:ObjectId,
    ref:'User'
  },
  active: {type:Boolean,
  default:true
  },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', Product);
