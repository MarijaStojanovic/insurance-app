const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { emailRegExp } = require('../lib/misc');

const Schema = mongoose.Schema;

const roleTypes = ['Admin', 'User'];

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegExp, 'Invalid email'],
    required: 'Please enter an email address',
  },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true, enum: roleTypes, default: 'User' },
}, { timestamps: true });

// Can not use arrow function, because this.password needs to work
// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  roleTypes,
};
