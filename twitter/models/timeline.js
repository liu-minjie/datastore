const util = require('../util');
const mongoose = require('mongoose');
const tweetSchema = require('./tweetSchema');
const Timeline = mongoose.model('Timeline', tweetSchema);
const Friend = require('./friend').Friend;

exports.add = function(data, cb) {
  data.status = -1;
  data.hasReply = false;
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

exports.page = function (name, page, cb) {
  if (page > 1) {
    Timeline.find({
      belong: name
    }).sort({
      'created_at': 1
    }).skip(50 * (page - 1)).limit(50).exec((err, res) => {
      cb(err, res);
    })
  } else {
    Friend. find({
      screen_name: name
    }, (error, result) => {
      Timeline.find({
        belong: name
      }).sort({
        'created_at': 1
      }).skip(50 * (page - 1)).limit(50).exec((err, res) => {
        cb(err || error, res, result);
      })
    })
  }  
}


exports.read = function (id,  name, cb) {
  Timeline.find({
    id_str: id,
    belong: name
  }, (err, list) => {
    if (err) {
      return cb(err);
    }
    Timeline.update({
      belong: name,
      created_at: {$lte: list[0].created_at}
      ,status: -1
    }, {
      $set: {
        status: 1
      }
    }, {multi: true}, (err, result) => {
      console.log(err, result);
      cb(err, result);
    })
  });
}


exports.addStr = function (data, cb) {
  data = data.map((item) => {
    return {
      updateOne: {
        filter: { id_str: item.id_str },
        update: { in_reply_to_status_id_str: item.in_reply_to_status_id_str }
      }
    }
  });
  if (!data.length) {
    return cb();
  }
  Timeline.bulkWrite(data).then((res) => {
    console.log(res.matchedCount, res.modifiedCount);
    cb();
  }).catch((err) => {
    console.log(err);
  });
}


/*
exports.addStr = function (data, cb) {
  Timeline.update({
    id_str: data.id_str
  }, {
    $set: {
      in_reply_to_status_id_str: data.in_reply_to_status_id_str
    }
  }, (err, res) => {
    cb(err, res);
  })
}
*/

exports.Timeline = Timeline;


