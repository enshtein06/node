const mongoose = require('mongoose');

var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
});

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