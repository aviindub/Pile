/*
*module to get arrays of frags
*/

var redis = require('redis');
var client = redis.createClient();

function recGetFrags (array, nextIndex, results, callback) {
	if (array.length === nextIndex) {
		callback(null, results);
	} else {
		client.hgetall(array[nextIndex], function(error, result){
			if (error) {
				callback(error, null);
			} else {
				results.push(result);
				recGetFrags(array, nextIndex+1, results, callback);
			}
		});
	}
}

//callback gets results[] which contains frags
function getFrags (fragIDs, callback) {
	var results = [];
	recMGetRange (fragIDs, 0, results, callback);
}

module.exports.getUserFrags = function(username, callback) {
	client.smembers(username, function(error, fragIDs) {
		getFrags(fragIDs, callback);
	});
};

module.exports.getCommunityFrags = function(callback) {
	client.smembers('users', function(error, users) {
		client.sunion(users, function(error, fragIDs) {  //unsure if kosher to pass array as 1st arg here instead of listing out keys
			getFrags(fragIDs, callback);
		});
	});
};


