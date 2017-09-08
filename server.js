var http = require("http");
var fs = require('fs');
var express = require('express');


var app = express();
	app.use('/js',express.static(__dirname + '/js'));
	app.use('/css',express.static(__dirname + '/css'));
	app.use('/data',express.static(__dirname + '/data'));
	// app.all('/*', function(req, res, next) {
	//     // Just send the index.html for other files to support HTML5Mode
	//     response.sendFile('view.html', { root: __dirname });
	// });
	app.get('/view', function (req, res) {
		res.sendfile('view.html')
	});

	app.post('/getData',function(req,res){
		var url = "mongodb://localhost:27017/mydb";
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect(url, function(err, db) {
		  db.collection("test").find({}).toArray(function(err, result) {
			    if (err) throw err;
			    db.close();
			    res.status(200).json({data:result});
			  });

		});
		
		
	});

	app.listen(8888);

console.log('Server running at http://127.0.0.1:8888/');