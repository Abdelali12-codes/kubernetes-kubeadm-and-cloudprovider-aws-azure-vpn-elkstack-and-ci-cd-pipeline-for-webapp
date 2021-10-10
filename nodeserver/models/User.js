const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: 'Username already exists',
    trim: true
  },
  email: {
    type: String,
    unique: 'Email already exists',
    trim: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
    type: String
  }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.method('hashPassword', function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
  } else {
    return password;
  }
});

/**
 * Create instance method for authenticating user
 */
UserSchema.method('authenticate', function (password) {
  return this.password === this.hashPassword(password);
});

mongoose.model('User', UserSchema);
