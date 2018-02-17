const util = require('../util');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const Member = mongoose.model('ListMember', userSchema);

exports.add = function(data, cb) {
	const member = new Member(data);
	member.save((err, saved) => {
		if (err) {
      util.dingding('add.member', { err, data });
      return cb(err);
    }
    cb( null, saved);
	});
}
exports.get = function (belong, cb) {
	Member.find({belong}, (err, list) => {
		if (err) {
      util.dingding('get.member', { err, belong });
      return cb(err);
    }
    cb(null, list);
	})
}
