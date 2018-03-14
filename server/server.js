//run mongodb C:\Program Files\MongoDB\Server\3.6\bin>mongod.exe --dbpath /Users/Askhat/mongo_data

require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

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

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then(todo => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}, e => {
		res.status(400).send(e);
	});
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;

	//takes object and array that we pull off is they exist
	// we want allow to update just text and completed properties
	var body = _.pick(req.body, ['text', 'completed']);
	
	if(!ObjectID.isValid(id)){
		res.status(404).send();
	}

	//checking completed value;; check completed valey to be boolean
	// and if it's true
	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime(); //return number of milliseconds
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
		.then(todo => {
			if(!todo) {
				return res.status(404).send();
			}

			res.send({todo});
		}).catch(e => {res.status(404).send()})
});

//POST /users
app.post('/users', (req, res) => {
	// take filled email and password from req.body
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	// token are needed to get access after auth

	user.save().then(() => {
		return user.generateAuthToken();
		//res.send(user);
	}).then((token) => {
		res.header('x-auth', token).send(user);//x- means create custom header
	}).catch(e => {res.status(400).send(e)});
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
})


app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {
	app
}