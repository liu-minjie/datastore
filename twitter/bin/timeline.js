const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const mongoose = require('mongoose');
const timelineApi = require('../models/timeline');

const statDir = path.resolve(__dirname, '../../../twitterbot/users/') + '/' ;
const dir = fs.readdirSync(statDir);

const files = [].slice.call(dir, 0).filter((filename) => {
	return /\.json$/.test(filename);
});

let follower;

try {
	follower = require('../data/favorite.json');
} catch (e) {
	if (e.code === 'MODULE_NOT_FOUND') {
		follower = [];
	} else {
		console.log(e);
		process.exit(0);
	}
}


async.eachSeries(files, (filename, next) => {
	const belong = filename.replace(/\.json$/, '');
	const data = require(`${statDir}${filename}`);
	let cache;
	try {
		cache = require(`../data/users/cached_timeline_${belong}.json`)
	} catch(e) {
		if (e.code === 'MODULE_NOT_FOUND') {
			cache = {};
		} else {
			console.log(e);
			process.exit(0);
		}
	}
	if (follower.indexOf(belong) === -1) {
		follower.push(belong);
		fs.writeFileSync('../data/timeline.json', JSON.stringify(follower, null, 1), "utf8");
	}

	const list = data.lists.filter((item) => {
		return item && !cache[item.id_str];
	});
	list.forEach((tweet) => {
		tweet.belong = belong;
		tweet.id = tweet.id + '';
		if (!tweet.id_str) {
			tweet.id_str = tweet.id_str || tweet.id;
		}
		tweet.created_at = moment(new Date(tweet.created_at)).format('YYYY-MM-DD HH:mm:ss');
		cache[tweet.id_str] = true;
		if (tweet.retweeted_status) {
			tweet.retweeted_status.id = tweet.retweeted_status + '';
			if (!tweet.retweeted_status.id_str) {
				tweet.retweeted_status.id_str = tweet.retweeted_status.id_str || tweet.retweeted_status.id;
			}
			tweet.retweeted_status.created_at = moment(new Date(tweet.retweeted_status.created_at)).format('YYYY-MM-DD HH:mm:ss');
			tweet.retweeted_status.belong = belong;
		}
	});

	async.eachSeries(list, timelineApi.add, (err, result) => {
		if (err) {
			return next(err);
		}
		
		fs.writeFileSync(`../data/users/cached_timeline_${belong}.json`, JSON.stringify(cache, null, 1), "utf8");
		next();
	});
}, (err, result) => {
	mongoose.connection.close()
	console.log(err, 'end');
});