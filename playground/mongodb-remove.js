const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*Todo.remove({}).then(res => {
	console.log(res);
});


Todo.findOneAndRemove({_id: '5aa8b9af268d0b11151231a3'}).then(todo => {
	console.log(res);
});*/

Todo.findByIdAndRemove('5aa8b9af268d0b11151231a3').then(todo => {
	console.log(todo);
});