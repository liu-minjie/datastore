const util = require('../util');
const mongoose = require('mongoose');
const tweetSchema = require('./tweetSchema');
const Favorite = mongoose.model('Favorite', tweetSchema);

exports.add = function(data, cb) {
	const favorite = new Favorite(data);
	favorite.save((err, saved) => {
		if (err) {
      util.dingding('add.favorite', { err, data });
      return cb(err);
    }
    cb( null, saved);
	});
}
exports.get = function (belong, cb) {
	Favorite.find({belong}, (err, list) => {
		if (err) {
      util.dingding('get.favorite', { err, belong });
      return cb(err);
    }
    cb(null, list);
	});
}
