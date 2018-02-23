const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const mongoose = require('mongoose');
const timelineApi = require('../models/timeline');

const dirName = '../../../twitterbot/str/';
const dir = fs.readdirSync(dirName);
const files = [].slice.call(dir, 0).filter((filename) => {
	return /\.json$/.test(filename);
});


const total = files.length;
let count = 0;
async.eachSeries(files, (filename, next) => {
	count++
	console.log((count / total).toFixed(2) * 100);
	const list = require(dirName + filename);
	const data = list.filter((item) => {
		return !!item.in_reply_to_status_id_str;
	});
	timelineApi.addStr(data, next);
}, (err) => {
	console.log(err, 'ok');
})




/*
async.eachSeries(files, (filename, next) => {
	const list = require(dirName + filename);
	const data = list.filter((item) => {
		return !!item.in_reply_to_status_id_str;
	});
	async.eachSeries(data, timelineApi.addStr, (err, result) => {
		next(err);
	});
}, (err) => {
	console.log(err, 'ok');
})
*/


