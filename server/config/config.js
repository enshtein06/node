var env = process.env.NODE_ENV || 'development'; //it sets on heroku
//export NODE_ENV=test || SET NODE_ENV=test && --- this command was added for production 

if(env === 'development' || env === 'test') {
	//require json file
	var config = require('./config.json');
	var envConfig = config[env];

	Object.keys(envConfig).forEach(key => {
		process.env[key] = envConfig[key];
	});
}

/*
if (env === 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
*/