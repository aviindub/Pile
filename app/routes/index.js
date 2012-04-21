/*
 * GET home page.
 */

var frags = require('./FragDatabaseModule');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

