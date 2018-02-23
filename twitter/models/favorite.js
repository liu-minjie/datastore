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

exports.addStr = function (data, cb) {
  Favorite.update({
    id_str: data.id_str
  }, {
    $set: {
      in_reply_to_status_id_str: data.in_reply_to_status_id_str
    }
  }, (err, res) => {
    console.log(res);
    cb(err, res);
  })
}
