const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const mongoose = require('mongoose');
const User = require('./models/user');

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

//template engine
app.set("view engine", "ejs");
app.set('views', 'views');

//use static files
app.use(express.static(path.join(__dirname, 'public')));

//middleware function
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store: store
}));

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//error route
app.use(errorsController.error404);

mongoose.connect(MONGODB_URI)
.then(result => {
	User.findOne().then(user => {
		if (!user) {
			const user = new User({
				name: 'Max',
				email: 'max@test.com',
				cart: {items: []}
			});
			user.save();
		}
	});
	app.listen(3000);
})
.catch(err => console.log(err));