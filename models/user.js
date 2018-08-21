'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// ===== Define UserSchema & UserModel =====

const userSchema = new mongoose.Schema({
	
	fullname: { 
		type: String, 
		default: '' 
	},
	
	username: {
		type: String,
		required: true,
		unique: true
	},
	
	password: { 
		type: String, 
		required: true
	}
}) 

userSchema.set('toObject', {
	virtuals: true, // include built-in virtual `id`
	versionKey: false, // remove `__v` version key
	transform: (doc, ret) => {
		delete ret._id; // delete `_id`
		delete ret.password;
	}
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
	return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
