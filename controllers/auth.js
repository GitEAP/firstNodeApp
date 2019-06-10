const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	// const isLoggedIn = req.get('Cookie')
	// .split(';')[1]
	// .trim()
	// .split('=')[1] === 'true';

	res.render('auth/login', { 
		pageTitle: 'Login', 
		path: '/login',
		isAuthenticated: false
	});
};

exports.postLogin = (req, res, next) => {
	// res.setHeader('Set-Cookie', 'loggedIn=true');
	User.findById('5cfacde93240fba051f536f2')
	.then(user => {
		req.session.isLoggedIn = true;
		req.session.user = user;
		req.session.save((err) => {
			console.log(err);
			res.redirect('/');
		});
	})
	.catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};