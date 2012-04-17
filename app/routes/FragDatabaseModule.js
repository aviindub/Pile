/*
*module to get arrays of frags
*/

var redis = require('redis');
var client = redis.createClient();

module.exports.getUserFrags = function (username, callback) {
	callback(null, arrayOfFrags);
};

module.exports.getCommunityFrags = function (callback) {
	callback(null, arrayOfFrags);
};