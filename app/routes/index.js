/*
 * GET home page.
 */
 
var frags = require('./FragDatabaseModule');


exports.index = function(req, res){
	console.log("index called");
	res.render('index', { title: 'Express' });
};

exports.userpile = function(req, res) {
	//route for individual user piles
	console.log("piles.js user called");
	var username;
	if (req.params.user === 'avitest') {
		console.log("using test route part 2");
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
	var data = JSON.parse(req.param('saveData', null);
	frags.saveFragPositions(data, req.session.user);
}

exports.createFrag = function(req, res) {
	//handle POST of new frag data
	frags.createFrag(req.param('content', null), req.session.user, function(error) { 
		//add error handling
		res.redirect('/piles/' + req.session.user);
	});
}
