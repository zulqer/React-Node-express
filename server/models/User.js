var mongoose = require('mongoose');
const { body } = require('express-validator/check');

var User = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type:String,
    default:''
  },
  active:{
    type:Boolean,
    default:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', User);
