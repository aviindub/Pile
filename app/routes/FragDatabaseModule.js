/*
* module to get arrays of frags
* getUserFrags() -- gets an array of frag objects that belong to a given username
* getCommunityFrags -- gets an array containing all frags in the system
*
*/

var redis = require('redis');
var client = redis.createClient();


//callback gets results[] which contains frags
function getFrags (fragIDs, callback) {
	//function to initialize the recursive function
	var results = [];
	recGetFrags (fragIDs, 0, results, callback);
}

function recGetFrags (fragIDs, nextIndex, results, callback) {
	//recursive function to force db calls to be done sequentially
	//this ensures that callback is only called once all results have returned
	if (fragIDs.length === nextIndex) {
		callback(null, results);
	} else {
		client.hgetall(fragIDs[nextIndex], function(error, result){
			if (error) {
				console.log("error getting frag from database");
				callback(error, null);
			} else {
				result['fragID'] = fragIDs[nextIndex];
				results.push(result);
				recGetFrags(fragIDs, nextIndex+1, results, callback);
			}
		});
	}
}


exports.getUserFrags = function(username, callback) {
	//get list of fragIDs for given username
	//get frags for those IDs
	client.smembers(username + 'frags', function(error, fragIDs) {
		if (error) {
			console.log("error getting user fragid list");
			callback(error, null);
		} else {
			getFrags(fragIDs, callback);
		}
	});
};

exports.getCommunityFrags = function(callback) {
	//get all usernames
	//get a list of fragIDs that is the union of all fragIDs for all usernames
	//get frags for those IDs
	client.smembers('users', function(error, users) {
		if (error) {
			console.log(error);
			callback(error, null);
		} else {
			for (var i = 0; i < users.length ; i++) {
				users[i] += 'frags';
			}
			client.sunion(users, function(error, fragIDs) {
				if (error) {
					console.log(error);
					callback(error, null);
				} else {	
					getFrags(fragIDs, callback);
				}
			});
		}
	});
};

exports.createFrag = function(content, user, callback) {
	//increment fragcount returns new frag id
	//add new frag id to users frag set
	//add the frag to the database
	client.incr('fragcount', function(error, nextFragID) {
		if (error) {
			console.log("error incrementing fragcount");
			//console.log(error);
			callback(error);
		} else {
			client.sadd(user + 'frags', nextFragID, function(error, result){ 
				if (error) {
					console.log("error adding fragid to userfrags");
					//console.log(error);
					callback(error);
				} else {
					client.hmset(nextFragID, 'content', content, 'user', user, 'posTop', '50', 'posLeft', '50', function(error, result) {
						if (error) {
							console.log("error creating frag");
							//console.log(error);
							callback(error);
						} else {
							callback(null);
						}
					});
				}
			});
		}		
	});
}

exports.saveFragPositions = function(data, user) {
	var newPositions = data.newPositions;
	for (var i = 0 ; i < newPositions.length ; i++) {
		var fragID = newPositions[i].fragID;
		var top = newPositions[i].top;
		var left = newPositions[i].left;
		client.hmset(fragID, 'postop', top, 'posleft', left, function(error){ 
			if(error){
				console.log("error saving frag positions in fragDatabaseModule");
				console.log(error);
			}
		});
	}
};
