const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
	url: {
		type: String
	},
	expand: {
		type: String
	}
});
const userSchema = new mongoose.Schema({
	id_str: {
		type: String,
		required: true
	},
	id: {
		type: String
	},
	screen_name: {
		type: String,
		required: true
	},
	statuses_count: {
		type: Number
	},
	favourites_count: {
		type: Number
	},
	listed_count: {
		type: Number
	},
	followers_count: {
		type: Number
	},
	friends_count: {
		type: Number
	},
	created_at: {
		type: Date
	},
	location: {
		type: String
	},
	url: {
		type: String
	},
	description: {
		type: String
	},
	urls: {
		type: [urlSchema]
	},
	belong: {
		type: String
	},
	status: {
		type: Number
	}
});

module.exports = userSchema;