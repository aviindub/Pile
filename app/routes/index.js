/*
 * GET home page.
 */

var frags = require('FragDatabaseModule');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.user = function(req, res) {
	var username = req.params.user;
	frags.getUserFrags(username, function(error, result) {
		var data = {'username': username, 'frags': result};
		res.render('user', data);
	});
};

exports.community = function(req, res) {
	frags.getCommunityFrags(function(error, result) {
		var data = {'frags': result};
		res.render('community', data);
	});
};