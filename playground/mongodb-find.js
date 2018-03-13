const {MongoClient, ObjectID} = require('mongodb');

//get connection to localhost
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('Connected to mongodb server');
	//.toArray returns the Promise
	//to find el with an ID we must write new ObjectID(ID)
	/*db.collection('Todos').find({
		_id: new ObjectID('5aa7659f48531ca84954fcaa')
	}).toArray().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, err => {
		console.log('Unable to fetch todos', err);
	});*/

	//.count() method counts aviable documents in collection
	/*db.collection('Todos').find().count().then((count) => {
		console.log(`Todos count: ${count}`);
	}, err => {
		console.log('Unable to fetch todos', err);
	});*/

	/*db.collection('Users').find({name: 'Askhat'}).count().then(count => {
		console.log(`Users count: ${count}`);
	}, err => {
		console.log('Unable to fetch users', err)
	})*/

	db.collection('Users').find({name: 'Askhat'}).toArray().then(docs => {
		console.log('Users');
		console.log(JSON.stringify(docs, undefined, 2));
	}, err => {
		console.log('Unable to fetch users', err);
	})

	//db.close();
});