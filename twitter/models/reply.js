const util = require('../util');
const mongoose = require('mongoose');
const replySchema = require('./replySchema');
const Reply = mongoose.model('Reply', replySchema);
const Timeline = require('./timeline').Timeline;

exports.add = function(data, cb) {
	const reply = new Reply(data);
	reply.save((err, saved) => {
		if (err) {
      util.dingding('add.reply', { err, data });
      return cb(err);
    }

    Timeline.update({
      id_str: data.tid
    }, {
      $set: {hasReply: true}
    }, (err, update) => {
      console.log(update);
      cb( err, saved);
    })
	});
}
exports.get = function (id, cb) {
	Reply.find({tid: id}, (err, list) => {
		if (err) {
      util.dingding('get.reply', { err, belong });
      return cb(err);
    }

    cb(null, list);
	});
}


