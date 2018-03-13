const {MongoClient, ObjectID} = require('mongodb');

//get connection to localhost
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('Connected to mongodb server');
	
	//deleteMany
	/*db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(res => {
		console.log(res);
	});*/

	//deleteOne
	/*db.collection('Todos').deleteOne({text: 'Eat lunch'}).then(res => {
		console.log(res);
	});*/

	//findOneAndDelete
	/*db.collection('Todos').findOneAndDelete({completed: false}).then(result => {
		console.log(result);
	});*/

	/*db.collection('Users').findOneAndDelete({name: 'Askhat'}).then(result => {
		console.log(result);
	})*/

	db.collection('Users').deleteMany({_id: new ObjectID('5aa764233223d30ac46350b4')}).then(result => {
		console.log(result);
	})

	//db.close();
});