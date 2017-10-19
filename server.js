const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

const port = process.env.PORT || 8080;
const app = express();

// configuration =======================================================================

// connect to database
mongoose.connect(configDB.url, { useMongoClient: true });

require('./config/passport')(passport); // pass passport for configuration

// set up express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // get info from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'thebestsecretandyoucannotknowit' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // display flash messages stored in session

// routes =======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and configured passport

// launch =======================================================================
app.listen(port);
console.log(`Sever up and running on port ${port}`);
