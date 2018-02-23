const util = require('../util');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const Friend = mongoose.model('Friend', userSchema);

exports.add = function(data, cb) {
	const friend = new Friend(data);
	friend.save((err, saved) => {
		if (err) {
      util.dingding('add.friend', { err, data });
      return cb(err);
    }
    cb( null, saved);
	});
}
exports.get = function (belong, cb) {
	Friend.find({belong}, (err, list) => {
		if (err) {
      util.dingding('get.friend', { err, belong });
      return cb(err);
    }
    cb(null, list);
	})
}

exports.Friend = Friend;