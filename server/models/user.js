const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
//user model: 
/*
{
	email: 'enshtein06@gmail.com',
	password: 'asdadg2rsd23rsdc',
	tokens: [{
		access: 'auth',
		token: '2iekj12nejk12henkndslkijio1'
	}]
}
*/

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALLUE} is not valid'
		}
	}, 
	password: {
		type: String,
		required: true,
		minlength: 8
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', "email"]);
}

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);
	return user.save().then(() => {
		return token;
	})
}

var User = mongoose.model('User', UserSchema);

/*
var firstUser = new User({
	email: 'enshtein@example.com'
});

firstUser.save().then(doc => {
	console.log('Saved User', doc);
}, e => {
	console.log('Unable to save todo');
});*/

module.exports = {
	User
};