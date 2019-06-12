const express = require('express');
const { check, body } = require('express-validator/check');

const router = express.Router();
const authController = require('../controllers/auth.js');
const User = require('../models/user.js');

router.get('/login', authController.getLogin);

router.post('/login', 
	check('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.normalizeEmail(),
	check('password')
		.isLength({min: 5})
		.isAlphanumeric()
		.withMessage('Please enter a valid password')
		.trim(),
	authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
	check('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.custom((value, {req}) => {
			return User.findOne({email: value})
				.then(userDoc => {
					if (userDoc) {
						return Promise.reject('Email exists already, please pick a different one');
					}
				})
		})
		.normalizeEmail(),
		// .custom((value, {req}) => {
		// 	if (value === 'test@test.com') {
		// 		throw new Error('This email address is forbidden');
		// 	}
			// return true;
		// })	
	body('password', 'Password must be at least 5 characters long with only numbers/text')
		.isLength({min: 5})
		.isAlphanumeric()
		.trim(),
	body('confirmPassword')
		.trim()
		.custom((value, {req}) => {
			if (value !== req.body.password) {
				throw new Error('Passwords have to match');
			}
			return true;
		}),
	authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;