var mongoose = require('mongoose');
const { body } = require('express-validator/check');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;
var Session = new mongoose.Schema({
  userId: {type:ObjectId,ref:'User'},
  authToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', Session);
