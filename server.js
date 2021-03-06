// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var passport = require('passport');
var flash = require('connect-flash');
var database = require('./config/database'); 			// load the database config
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var cookieParser = require('cookie-parser');

// configuration ===============================================================
mongoose.connect(database.url);

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(cookieParser());

app.use(session({ secret: 'ilovescotchscothcyscotchdayne'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes ======================================================================
require('./app/routes.js')(app, passport);
require('./config/passport')(passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
