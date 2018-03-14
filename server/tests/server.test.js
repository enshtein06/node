const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//create dummy todos to avoid db being empty
const todos = [{
	text: 'First test todo',
	_id: new ObjectID()
}, {
	text: 'Second test todo',
	_id: new ObjectID()
}];

//to setup database. make sure that db are empty
beforeEach(done => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}
				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1); 
					expect(todos[0].text).toBe(text);
					done();
				}).catch(e => done(e));
			});
	});

	it('Should not create todo with invalid body data', done => {
		var text = '';

		request(app)
			.post('/todos')
			.send()
			.expect(400)
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);//it must have 2 cuz we used 2 dummy todos above
					done();
				}).catch(e => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`) //here we conver id to str
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
				expect(res.body.todo.text).toBe(todos[0].text)
			})
			.end(done);
	});

	it('should return 404 if todo not found', done => {
		var hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if ObjectID isNotValid', done => {
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete todo', done => {
		var ID = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${ID}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end((err, res) => {
				if(!err) {
					return done(err);
				}
				Todo.findById(ID).then(todo => {
					expect(todo).toNotExist();
					done();
				}).catch(e => done)
			});
	});

	it('should return 404 if ObjectID isNotValid', (done) => {
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});
});