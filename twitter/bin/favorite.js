const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const mongoose = require('mongoose');
const favoriteApi = require('../models/favorite');

const statDir = path.resolve(__dirname, '../../../twitterbot/stat/') + '/' ;
const dir = fs.readdirSync(statDir);

const files = [].slice.call(dir, 0).filter((filename) => {
	return filename.indexOf('getFavoritesList_') === 0;
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
	const belong = filename.split('_')[1].split('.')[0];
	const data = require(`${statDir}${filename}`);
	let cache;
	try {
		cache = require(`../data/cached_getFavoritesList_${belong}.json`)
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
		fs.writeFileSync('../data/favorite.json', JSON.stringify(follower, null, 1), "utf8");
	}

	const list = data.lists.filter((item) => {
		return !cache[item.id_str];
	});
	list.forEach((friend) => {
		friend.belong = belong;
		friend.id = friend.id + '';
		friend.created_at = moment(new Date(friend.created_at)).format('YYYY-MM-DD HH:mm:ss');
		cache[friend.id_str] = true;
	});

	async.eachSeries(list, favoriteApi.add, (err, result) => {
		if (err) {
			return next(err);
		}
		
		fs.writeFileSync(`../data/cached_getFavoritesList_${belong}.json`, JSON.stringify(cache, null, 1), "utf8");
		next();
	});
}, (err, result) => {
	mongoose.connection.close()
	console.log(err, 'end');
});