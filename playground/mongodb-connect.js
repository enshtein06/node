const {MongoClient, ObjectID} = require('mongodb');

//get connection to localhost
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('Connected to mongodb server');
	//insert one object into todos database. Collection: Todos
	/*db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (error, result) => {
		if(error) {
			return console.log('Unable to insert todo', error);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	db.collection('Users').insertOne({
		name: 'Askhat',
		age: 20,
		location: 'Tomsk'
	}, (err, result) => {
		if(err) {
			return console.log('Unable to insert todo', error);
		}
		console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	});*/

	db.close();
});