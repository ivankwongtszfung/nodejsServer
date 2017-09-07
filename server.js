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

	app.listen(8888);

console.log('Server running at http://127.0.0.1:8888/');