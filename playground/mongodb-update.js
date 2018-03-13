const {MongoClient, ObjectID} = require('mongodb');

//get connection to localhost
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('Connected to mongodb server');
	
	//findOneAndUpdate
	// using mongodb update operators  https://docs.mongodb.com/manual/reference/operator/update/
	//using set updator uses to set new update
	//returnOriginal option of findOneAndUpdate method
	/*db.collection('Todos')
		.findOneAndUpdate({
			_id: new ObjectID('5aa7732d48531ca84954fe47'
		)},{
			$set: {
				completed: true
			}
		}, {
			returnOriginal: false
		}).then(result => {
			console.log(result);
		});*/

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5aa7641485586b0304136e05')
	}, {
		$set: {
			name: 'Andrew'
		},
		$inc: {
			age: 7
		}
	}, {
		returnOriginal: false
	}).then(result => {
		console.log(result)
	});

	//db.close();
});