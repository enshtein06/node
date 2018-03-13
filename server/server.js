//run mongodb C:\Program Files\MongoDB\Server\3.6\bin>mongod.exe --dbpath /Users/Askhat/mongo_data

const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

//post to create resourse
app.post('/todos', (req, res) => {
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then(doc => {
		res.send(doc);
	}, e => {
		res.status(400).send(e);
	});	
});

//get method
app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, e => {
		res.status(400).send(e);
	})
});


app.listen(3000, () => {
	console.log('Started on port 3000');
});

module.exports = {
	app
}