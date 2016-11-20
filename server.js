var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
require('dotenv').config();
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var favicon  = require('serve-favicon');
app.use(favicon(__dirname + '/views/favicon.ico'));

mongoose.connect(process.env.MONGO_URL);
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(session({ secret: 'tigerhazel' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
require('./app/routes/login.js')(app,passport);
require('./app/routes/site.js')(app);
require('./app/routes/search.js')(app);




app.listen(port);
console.log('App is on at port ' + port);