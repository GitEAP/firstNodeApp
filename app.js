const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors.js');

//start express app
const app = express();

//template engine
app.set("view engine", "ejs");
app.set('views', 'views');

//use static files
app.use(express.static(path.join(__dirname, 'public')));

//middleware function
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  User.findById('5cfacde93240fba051f536f2')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//error route
app.use(errorsController.error404);

mongoose.connect('mongodb+srv://erickp:mongoSFA@testdb-i08z9.mongodb.net/testDB?retryWrites=true&w=majority')
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


