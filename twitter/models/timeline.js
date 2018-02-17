const util = require('../util');
const mongoose = require('mongoose');
const tweetSchema = require('./tweetSchema');
const Timeline = mongoose.model('Timeline', tweetSchema);

exports.add = function(data, cb) {
	const timeline = new Timeline(data);
	timeline.save((err, saved) => {
		if (err) {
      util.dingding('add.timeline', { err, data });
      return cb(err);
    }
    cb( null, saved);
	});
}
exports.get = function (belong, cb) {
	Timeline.find({belong}).limit(5).exec((err, list) => {
    if (err) {
      util.dingding('get.timeline', { err, belong });
      return cb(err);
    }
    cb(null, list);
  });
}
