module.exports.authenticate = function(login, password, callback) {
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
		}
	});
};
