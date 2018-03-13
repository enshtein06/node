const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*var id = '5aa7cdc43af757c430f79fd9';

if (!ObjectID.isValid(id + '2')) {
	console.log('Id not valid');
};

Todo.find({
	_id: id //it's valid without new ObjectID because of mongoose
}).then(todos => {
	console.log('Todos', todos);
});

//takes first
Todo.findOne({
	completed: false
}).then(todo => {
	console.log('Todo', todo);
});

//takes by id
Todo.findById(id).then(todo => {
	if(!todo) {
		return console.log('Id not found');
	}
	console.log('Todo: ', todo);
}).catch(e => console.log(e));*/

User.find({
	_id: '5aa78b7b09b757384167e6af'
}).then(users => {
	console.log('Users', users);
}).catch(e => console.log(e));

User.findOne({
	_id: '5aa78b7b09b757384167e6af'
}).then(user => {
	console.log('User', user);
}).catch(e => console.log(e));

User.findById({
	_id: '5aa78b7b09b757384167e6af'
}).then(user => {
	console.log('User', user);
}).catch(e => console.log(e));