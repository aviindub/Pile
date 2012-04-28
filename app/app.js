
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , redis = require('redis')
  , RedisStore = require('connect-redis')(express);

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
  app.use(express.cookieParser({secret:'super duper secret', store:new RedisStore}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//Sessions


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

app.get('/piles/:user', function(req, res) {
	if(req.session) {
		if (req.session.user === req.params.user) {
		//show user's pile
		routes.user;
		}
	} else if (req.params.user === 'avitest') {
		console.log("using test route");
		routes.userpile(req, res);
	} else {
		res.redirect('/login');
	}	
});



//Routes

app.get('/groups/:pile', routes.pile);

app.get('/', routes.index);

app.post("/piles/saveUserPile", routes.saveUserPile);

app.post("/frags/createFrag" , routes.createFrag);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");
