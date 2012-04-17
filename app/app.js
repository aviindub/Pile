
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.cookieParser());
  app.use(express.session({secret:'secret'}{store:new RedisStore}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Sessions

var users = require('./users');

function authRoute(req, res, next) {
	if(req.session.authenticated) {
		next();
	}else {
		res.redirect('/login');
	}
}

app.get('/login', function(req,res) {
	res.render('login');
});

app.get('/:user', function(req, res) {
	if(req.session.user.login === req.params.user) {
		//show dashboard
	} else {
		//show profile
	}	
});

//Routes

app.get('/', routes.index);

app.get('/users/:user', routes.user);

app.get("/community", routes.community);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");
