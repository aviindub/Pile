/*
* pile related routes
*/

exports.user = function(req, res) {
	//route for individual user piles
	var username = req.params.user;
	frags.getUserFrags(username, function(error, result) {
		var data = {username: username, frags: result};
		res.render('user', data);
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