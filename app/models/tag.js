var mongoose = require('mongoose');

module.exports = mongoose.model('tag', {
	tag : {type : String, default: ''},
	peerIDs : {type : Array, default: []}
});
