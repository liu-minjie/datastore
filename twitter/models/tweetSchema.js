const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
	url: {
		type: String
	},
	expand: {
		type: String
	}
});
const tweetSchema = new mongoose.Schema({
	id_str: {
		type: String,
		required: true
	},
	id: {
		type: String
	},
	created_at: {
		type: Date
	},
	text: {
		type: String
	},
	retweet_count: {
		type: Number
	},
	favorite_count: {
		type: Number
	},
	in_reply_to_status_id: {
		type: String
	},
	in_reply_to_screen_name: {
		type: String
	},
	in_reply_to_status_id_str: {
		type: String
	},
	owner: {
		type: String
	},
	place: {
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
	},
	hasReply: {
		type: Boolean
	},
	retweeted_status: {
		id_str: {
			type: String
		},
		id: {
			type: String
		},
		created_at: {
			type: Date
		},
		text: {
			type: String
		},
		retweet_count: {
			type: Number
		},
		favorite_count: {
			type: Number
		},
		in_reply_to_status_id: {
			type: String
		},
		in_reply_to_screen_name: {
			type: String
		},
		in_reply_to_status_id_str: {
			type: String
		},
		owner: {
			type: String
		},
		place: {
			type: String
		},
		urls: {
			type: [urlSchema]
		},
		belong: {
			type: String
		},
		status: {
			type: Number // 0: rm, 1: read, 2: favorite
		},
		reply: {
			type: [String]
		}
	}
});

module.exports = tweetSchema;