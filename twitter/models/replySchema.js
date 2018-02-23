const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
	name: {
		type: String
	},
	to: {
		type: [String]
	},
	content: {
		type: String
	}
});

const replySchema = new mongoose.Schema({
	tid: {
		type: String,
		unique: true, 
		dropDups: true
	},
	reply: {
		type: [[contentSchema]]
	}
});

module.exports = replySchema;