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
	recMGetRange (fragIDs, 0, results, callback);
}

function recGetFrags (array, nextIndex, results, callback) {
	//recursive function to force db calls to be done sequentially
	//this ensures that callback is only called once all results have returned
	if (array.length === nextIndex) {
		callback(null, results);
	} else {
		client.hgetall(array[nextIndex], function(error, result){
			if (error) {
				console.log(error);
				callback(error, null);
			} else {
				results.push(result);
				recGetFrags(array, nextIndex+1, results, callback);
			}
		});
	}
}


exports.getUserFrags = function(username, callback) {
	//get list of fragIDs for given username
	//get frags for those IDs
	client.smembers(username, function(error, fragIDs) {
		getFrags(fragIDs, callback);
	});
};

exports.getCommunityFrags = function(callback) {
	//get all usernames
	//get a list of fragIDs that is the union of all fragIDs for all usernames
	//get frags for those IDs
	client.smembers('users', function(error, users) {
		client.sunion(users, function(error, fragIDs) {  //unsure if kosher to pass array as 1st arg here instead of listing out keys
			getFrags(fragIDs, callback);
		});
	});
};


