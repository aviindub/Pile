
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.user = function(req, res) {
	var data = undefined;
	res.render('user', data);
};

exports.community = function(req, res) {
	var data = undefined;
	res.render('community', data);
};