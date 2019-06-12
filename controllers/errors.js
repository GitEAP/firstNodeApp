exports.error404 = (req,res,next) => {
	// res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
	res.status(404).render('errors/404', {
		pageTitle: 'Page Not Found',
		path: '/404',
		isAuthenticated: req.session.isLoggedIn
	});
};

exports.error500 = (req,res,next) => {
	// res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
	res.status(500).render('errors/500', {
		pageTitle: 'Error',
		path: '/500',
		isAuthenticated: req.session.isLoggedIn
	});
};

