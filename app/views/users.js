var users = {
	'avi' : {login: 'avi', password: 'password', role: 'admin'},
	'david' : {login: 'david', password: 'password', role: 'admin'}
	'rebekah' : {login: 'rebekah', password: 'password', role: 'admin'}
	'chris' : {login: 'chris', password: 'password', role: 'admin'}
};
module.exports.authenticate = function(login, password, callback) {
	var user = users[login];
	if (!user) {
		callback(null);
		return;
	}
	if (user.password == password) {
		callback(user);
		return;
	}
	callback(null);
};