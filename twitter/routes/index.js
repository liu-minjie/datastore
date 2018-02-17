const config = require('../config');
const express = require('express');
const router = express.Router();
const util = require('../util');
const friendApi = require('../models/friend');
const listMemberApi = require('../models/listMember');
const favoriteApi = require('../models/favorite');
const timelineApi = require('../models/timeline');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/friend', function(req, res, next) {
	let list;
	try {
		list = require('../data/friend.json');
	} catch (e) {
		list = [];
	}
	res.render('friend', {
		list: JSON.stringify(list)
	});
});
router.get('/list', function(req, res, next) {
	let list;
	try {
		list = require('../data/listCategory.json');
	} catch (e) {
		list = [];
	}
	res.render('list', {
		list: JSON.stringify(list)
	});
});

router.get('/favorite', function(req, res, next) {
	let list;
	try {
		list = require('../data/favorite.json');
	} catch (e) {
		list = [];
	}
	res.render('favorite', {
		list: JSON.stringify(list)
	});
});

router.get('/timeline', function(req, res, next) {
	let list;
	try {
		list = require('../data/timeline.json');
	} catch (e) {
		list = [];
	}
	res.render('timeline', {
		list: JSON.stringify(list)
	});
});

router.get('/timelineList', function(req, res, next) {

	timelineApi.get(req.query.name, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});


router.get('/favoriteList', function(req, res, next) {

	favoriteApi.get(req.query.name, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});

router.get('/friendList', function(req, res, next) {

	friendApi.get(req.query.name, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});

router.get('/memberList', function(req, res, next) {

	listMemberApi.get(req.query.name, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});

module.exports = router;