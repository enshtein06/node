const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true //remove all white spaces before string and mulpiple spaces
	},
	completed: {
		type: Boolean,
		default: false //consider default value as false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

//create model of Todo


/*//create new instance of Todo
var newTodo = new Todo({
	text: 'Cook dinner'
});

//save newTodo in mongodb
newTodo.save().then((doc) => {
	console.log('Saved todo', doc)
}, e => {
	console.log('Unable to save todo');
});

var secondTodo = new Todo({
	text: 'Edit this video'
})

secondTodo.save().then(doc => {
	console.log('Saved todo', doc);
}, e => {
	console.log('Unable to save todo');
});*/

module.exports = {
	Todo
};