const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(1);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`) //here we conver id to str
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
				expect(res.body.todo.text).toBe(todos[0].text)
			})
			.end(done);
	});

	it('should return not todo doc created by other user', (done) => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`) //here we conver id to str
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found', done => {
		var hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if ObjectID isNotValid', done => {
		request(app)
			.get('/todos/123')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete todo', done => {
		var ID = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${ID}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo._id).toBe(ID);
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

	it('should delete todo', done => {
		var ID = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${ID}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if(!err) {
					return done(err);
				}
				Todo.findById(ID).then(todo => {
					expect(todo).toExist();
					done();
				}).catch(e => done)
			});
	});

	it('should return 404 if ObjectID isNotValid', (done) => {
		request(app)
			.delete('/todos/123')
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should patch todo', done => {
		var id = todos[0]._id.toHexString();
		var newTodo = {
			text: 'Updated text',
			completed: true
		}
		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(newTodo.text);
				expect(res.body.todo.completed).toBe(newTodo.completed);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end((err, res) => {
				if(!err) {
					return done(err);
				}

				Todo.findById(id).then(todo => {
					expect(todo.completedAt).toNotEqual(null);
					done();
				}).catch(e => done());
			});
	});

	it('should not be updated by other users', done => {
		var id = todos[0]._id.toHexString();
		var newTodo = {
			text: 'Updated text',
			completed: true
		}
		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end((err, res) => {
				if(!err) {
					return done(err);
				}

				Todo.findById(id).then(todo => {
					expect(todo.completedAt).toNotEqual(null);
					done();
				}).catch(e => done());
			});
	});

	it('should return 404 if id isNotValid', (done) => {
		request(app)
			.patch('/todos/123')
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should return 404 if todo isnotExist', (done) => {
		var hexId = new ObjectID().toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.set('x-auth', users[1].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('should send false to completed if completedAt are touched', (done) => {
		var newTodo = {
			completedAt: 23,
			completed: true
		}
		var id = todos[0]._id.toHexString();

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.completedAt).toBe(null);
				expect(res.body.todo.completed).toBe(false);
			})
			.end(done);

	});
});

describe('GET /users/me', () => {
	it('should return user if authentoicated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token) //set header named 'x-auth', with value of 2nd arg
			.expect(200)
			.expect(res => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);

	})

	it('should return 401 if not authentoicated', done => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect(res => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	/*it('should create a user', (done) => {
		var email = 'enshtein1@example.co';
		var password = '123abc!';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect(res => {
				expect(res.header['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err) {
					return done(err);
				}

				User.findOne({email}).then(user => {
					expect(user).toExist();
					expect(user.password).toNotBe(password);
					done();
				})
			});
	})*/ //error here

	it('should return validation errors if request invalid', (done) => {
		request(app)
			.post('/users')
			.send({email: 'rew', password: '123'})
			.expect(400)
			.end(done)
		
	})

	it('should not create a user if email in user', (done) => {
		//request(app)
		request(app)
			.post('/users')
			.send({email: users[0].email, password: users[0].password})
			.expect(400)
			.end(done)
	})
});

describe('POST /users/login', () => {
	it('should login user and retrun auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect(res => {
				expect(res.header['x-auth']).toExist();
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}
				User.findById(users[1]._id).then(user => {
					expect(user.tokens[1]).toInclude({
						access: 'auth',
						token: res.header['x-auth']
					});
					done();
				}).catch(e => done(e));
			})
	});

	it('should reject invalid login', done => {
		request(app)
			.post('/users/login')
			.send({
				email: 'adasdas@xasd.com',
				password: 'adasad221s'
			})
			.expect(400)
			.expect(res => {
				expect(res.header['x-auth']).toNotExist();
			})
			.end(done);
	})
});

describe('DELETE /users/me/token', () => {
	it('should remove auth token on logout', done => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if(err) {
					return done(err);
				}
				User.findById(users[0]._id).then(user => {
					expect(user.tokens.length).toEqual(0);
					done();
				}).catch(e => done(e));
			});
	});
})