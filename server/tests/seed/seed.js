const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
	_id: userOneId,
	email: 'enshtein06@gmail.com',
	password: '1234567890',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: 'jen@example.com',
	password: 'userTwoPassword'
}]
//create dummy todos to avoid db being empty
const todos = [{
	text: 'First test todo',
	_id: new ObjectID()
}, {
	text: 'Second test todo',
	_id: new ObjectID()
}];

//to setup database. make sure that db are empty

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);// inserting documents if they are valid
	}).then(() => done());
}

const populateUsers = (done) => {
	//we remove every single records
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = {populateTodos, todos, populateUsers, users}