const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv').config();
const flash = require('connect-flash');
const methodOverride = require('method-override')

const pageRoute = require('./routes/pageRouter');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

const port = 3000;

mongoose.connect('mongodb://localhost:27017/smart-edu-db')
  .then(() => console.log('Connected DB!'));

//template engine
app.set("view engine", "ejs");

//global variable
global.userIN = null;

//middleware
app.use(express.static("public"));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(session({
  secret: 'my_keyboard_cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/smart-edu-db' })
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

//routes
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`Smart edu app listen on ${port} port`);
})