const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const mongoose = require('mongoose');
const listMemberApi = require('../models/listMember');

const statDir = path.resolve(__dirname, '../../../twitterbot/stat/') + '/' ;
const dir = fs.readdirSync(statDir);

const files = [].slice.call(dir, 0).filter((filename) => {
	return filename.indexOf('getListsMembers_') === 0;
});

if (files.length > 1) {
	console.log('balbo');
	process.exit(0);
}

let category;

try {
	category = require('../data/listCategory.json');
} catch (e) {
	if (e.code === 'MODULE_NOT_FOUND') {
		category = [];
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
		cache = require(`../data/cached_getListMembers_${belong}.json`)
	} catch(e) {
		if (e.code === 'MODULE_NOT_FOUND') {
			cache = {};
		} else {
			console.log(e);
			process.exit(0);
		}
	}


	
	async.eachSeries(Object.keys(data.list), (key, callback) => {
		cache[key]= cache[key] || {};
		if (category.indexOf(key) === -1) {
			category.push(key);
			fs.writeFileSync('../data/listCategory.json', JSON.stringify(category, null, 1), "utf8");
		}

		const list = data.list[key].filter((item) => {
			return !cache[key][item.screen_name];
		});
		list.forEach((friend) => {
			friend.belong = key;
			friend.id = friend.id + '';
			friend.created_at = moment(new Date(friend.created_at)).format('YYYY-MM-DD HH:mm:ss');
			cache[key][friend.screen_name] = true;
		});


		async.eachSeries(list, listMemberApi.add, (err, result) => {
			if (err) {
				return callback(err);
			}
			
			fs.writeFileSync(`../data/cached_listCategory_${belong}.json`, JSON.stringify(cache, null, 1), "utf8");
			callback();
		});
	}, (err, result) => {
		next(err, result);
	});
}, (err, result) => {
	mongoose.connection.close()
	console.log(err, 'end');
});