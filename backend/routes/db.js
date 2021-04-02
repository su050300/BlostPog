var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'BolstPog'
});
 
//display connected and ensure proper connection has been setup
connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
});

module.exports = connection;
