const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports.UserModel = mongoose.model('User', UserSchema);
