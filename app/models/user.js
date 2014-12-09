var mongoose = require('mongoose');

module.exports = mongoose.model('user', {
	username : {type : String, default: ''},
	password : {type : String, default: ''},
	peerID : {type : String, default: ''}
});
