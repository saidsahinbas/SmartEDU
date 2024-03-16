const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const pageRoute = require('./routes/pageRouter');
const courseRoute = require('./routes/courseRoute');

const app = express();

const port = 3000;

mongoose.connect('mongodb://localhost:27017/smart-edu-db')
  .then(() => console.log('Connected DB!'));

//template engine
app.set("view engine", "ejs");

//middleware
app.use(express.static("public"));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//routes
app.use('/', pageRoute);
app.use('/courses', courseRoute);

app.listen(port, () => {
    console.log(`Smart edu app listen on ${port} port`);
})