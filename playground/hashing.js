const {SHA256} = require('crypto-js'); //import hashing256 fucn
const jwt = require('jsonwebtoken');

var data = {
	id: 10
};

var token = jwt.sign(data, '123abc');//123abc is secret stored on the server to prevent access with correct value but with incorrect secret
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded);

/*var message ='I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`hash: ${hash}`);

var data = {
	id: 4
};

var token = {
	data,
	hash: SHA256(JSON.stringify(data) + "somesecret").toString()
};

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if(resultHash === token.hash) {
	console.log('Data was not changed');
} else {
	console.log('Data was changed!');
}*/

