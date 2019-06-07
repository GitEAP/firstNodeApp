const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoConnect = require('./util/database.js').mongoConnect;
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
  User.findById('5cf9c8191c9d440000f23144')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

//routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//error route
app.use(errorsController.error404);

mongoConnect(()=> {
	app.listen(3000);
});


