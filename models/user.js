const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    default: null
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
})

module.exports = mongoose.model('user',userSchema);