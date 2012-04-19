var users = {
	'avi' : {login: 'avi', password: 'password', role: 'admin'},
	'david' : {login: 'david', password: 'password', role: 'admin'}
	'rebekah' : {login: 'rebekah', password: 'password', role: 'admin'}
	'chris' : {login: 'chris', password: 'password', role: 'admin'}
};
/*
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
*/

module.exports.authenticate = function(login, password, callback) {
	client.IsInSet(users, login, function(error, exists) {
		if(exists) {
			client.get(login, function(error, userInfo) {
				if (error) {
					console.log(error);
					callback(error, null);
				}
				if (password === userInfo.password) {
					req.session.authenticated = true;
					req.session.user = login;
					callback(null, true);
				} else {
					callback(null, false);
				}
			});
		}
	});
};