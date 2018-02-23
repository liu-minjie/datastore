const config = require('../config');
const express = require('express');
const router = express.Router();
const util = require('../util');
const friendApi = require('../models/friend');
const listMemberApi = require('../models/listMember');
const favoriteApi = require('../models/favorite');
const timelineApi = require('../models/timeline');
const replyApi = require('../models/reply');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/friend/:name', function(req, res, next) {
	const name = req.params.name;
	const page = req.query.page || 1;

	timelineApi.page(name, page, (err, result, user) => {
		res.render('user', {
			user: user[0],
			list: JSON.stringify(result)
		});
	});
});

router.get('/api/user/:name', function(req, res, next) {
	const name = req.params.name;
	const page = req.query.page || 1;

	timelineApi.page(name, page, (err, result) => {
		res.send({
			success: !err,
			data: result
		});
	});
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


router.post('/reply', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
}, function(req, res, next) {
	replyApi.add({
		tid:req.query.id,
		reply: req.body
	}, (err) => {
		res.send({
	    success: !err
	  });
	});
});
router.get('/reply', (req, res) => {
	const tid = req.query.id;
	replyApi.get(tid, (err, result) => {
		res.send({
			success: !err,
			data: result
		})
	})
})
router.post('/timeline/read/:name', (req, res) => {
	const tid = req.query.id;
	const name = req.params.name;
	if (!tid || !name) {
		return res.send({
			success: false
		})
	}
	timelineApi.read(tid, name, (err, name, result) => {
		res.send({
			success: !err,
			data: result
		});
	})
})



router.get('/share', function(req, res, next) {
	res.send({
		success: true
	})
});
const multiparty = require('multiparty');
router.post('/share', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
}, function(req, res, next) {
	console.log(req.query, 1);
	console.log(req.body, 2);

	const form = new multiparty.Form({
  });
	form.parse(req, function(err, fields, files) {
    if (err) {
    	console.log(err);
      return res.send({
        success: false,
        message: ''
      });
    }
    console.log(files, 3);
    console.log(fields, 4);
    res.send({
      success: true
    })
  });
});

module.exports = router;