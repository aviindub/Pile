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
	client.sismember('users', login, function(error, exists) {
		if(exists === 1) {
			client.hgetall(login, function(error, userInfo) {
				if (error) {
					console.log(error);
					callback(error, null);
				} else {
				
					//reformat userInfo from array to hash
					var hashify = {};
					for (var i = 0; i < userInfo.length ; i += 2) {
						hashify[userInfo[i]] = userInfo[i+1];
					}
					userInfo = hashify;
					
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
	});
};