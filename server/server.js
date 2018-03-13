//run mongodb C:\Program Files\MongoDB\Server\3.6\bin>mongod.exe --dbpath /Users/Askhat/mongo_data

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

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
	});
});

//request by id
app.get('/todos/:id', (req, res) => {
	//req params brings is obj with typed above id
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findById({_id: id}).then(todo => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch(e => res.status(400).send(e));
});


app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {
	app
}