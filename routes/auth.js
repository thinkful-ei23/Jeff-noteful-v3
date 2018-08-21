'use strict';

const express = require('express');
const router = express.Router();


const passport = require('passport');
const mongoose = require('mongoose');

const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);



router.post('/login', localAuth, function (req, res) {
	return res.json(req.user);
});


module.exports = router;
