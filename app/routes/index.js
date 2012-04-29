/*
 * GET home page.
 */
var redis = require('redis');
var client = redis.createClient();
var frags = require('./FragDatabaseModule');


exports.index = function(req, res){
	console.log("index called");
	res.render('index', { title: 'Express' });
};

exports.user = function(req, res) {
	//route for individual user piles
	var username;
	if (req.params.user === 'avitest') {
		username = 'avi';
	} else {
		username = req.session.user;
	}
	frags.getUserFrags(username, function(error, result) {
		if (error) {
			console.log(error);
		} else {
			var data = {username: username, frags: result};
			res.render('user', data);
		}
	});
};

exports.pile = function(req, res) {
	//route for group piles
	if(req.params.pile === 'community') {
		frags.getCommunityFrags(function(error, result) {
			var data = {frags: result};
			res.render(community, data);
		});
	} else {
		//other piles
		//or just an error page
	}
};

exports.saveUserPile = function(req, res) {
	//handle AJAX post with updated frag positions
	var data = JSON.parse(req.param('saveData', null));
	frags.saveFragPositions(data, req.session.user);
}

exports.createFrag = function(req, res) {
	//handle POST of new frag data
	frags.createFrag(req.param('content', null), req.session.user, function(error) { 
		//add error handling
		res.redirect('/piles/' + req.session.user);
	});
}


exports.authenticate = function(req, res, login, password, callback) {
	//get the set of all users to make sure username is valid
	//if it exists, get the db entry for the username
	//if password matches, create auth session
	client.sismember('users', login, function(error, exists) {
		if(error) {
			console.log(error);
			callback(error, null);
		} else {
			if(exists === 1) {
				client.hgetall(login, function(error, userInfo) {
					if (error) {
						console.log(error);
						callback(error, null);
					} else {
						console.log(typeof(userInfo));
						console.log(userInfo);
						
						if (password === userInfo.password) {
							//if password match, create session
							req.session.authenticated = true;
							req.session.user = login;
							callback(null, true);
						} else {
							//no password match
							callback(null, false);
						}
					}
				});
			} else {
				//user doesnt exist
				callback(null, false);
			}
		}
	});
};
