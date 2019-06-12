// Package dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// database dependencies
const mongoose = require('mongoose');
const User = require('./models/user');

// routes and controller dependencies
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors.js');
const authRoutes = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://erickp:mongoSFA@testdb-i08z9.mongodb.net/testDB?retryWrites=true&w=majority';

//start express app
const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});
const csrfProtection = csrf();

//template engine
app.set("view engine", "ejs");
app.set('views', 'views');

//use static files
app.use(express.static(path.join(__dirname, 'public')));

//middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

// assign logged in user
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
  User.findById(req.session.user._id)
    .then(user => {
    	if (!user) {
    		return next();
    	}
      req.user = user;
      next();
    })
    .catch(err => {
    	next(new Error(err));
    });
});

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//error route
app.use(errorsController.error404);
app.use('/500', errorsController.error500);

app.use((error, req, res, next) => {
	// res.status(error.httpStatusCode).render();
	// res.redirect('/500');
	res.status(500).render('errors/500', {
		pageTitle: 'Error',
		path: '/500',
		isAuthenticated: req.session.isLoggedIn
	});
});

mongoose.connect(MONGODB_URI)
.then(result => {
	app.listen(3000);
})
.catch(err => console.log(err));