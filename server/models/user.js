const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
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
	var user = this;//instance method
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', "email"]);
};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);
	return user.save().then(() => {
		return token;
	})
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    /*return new Promise((resolve, reject) => {
    	reject();
    })*/
    return Promise.reject(); //its equal to example above
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

//we try to find user by email
UserSchema.statics.findByCredentials = function(email, password) {
	var user = this;

	//return promise
	return User.findOne({email}).then((user) => {
		if(!user) {
			//if we return reject it'll automaticly trigger catch block in code:
			//app.post('/users/login', (req, res) => {})
			return Promise.reject();
		}

		//bcrypt.compare only supports callback and not support Promises
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	});
};

//pre methods runs code before we save
UserSchema.pre('save', function(next) {
	var user = this;

//checks if argument was modified
	if(user.isModified('password')){
		bcrypt.genSalt(10, (err, salt) => {
			//we generate salting with 10 level of salting
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash; //hash is hashed value
				next();
			})
		})
	} else {
		next();
	}
	
})

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