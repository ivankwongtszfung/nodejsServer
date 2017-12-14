var http = require("http");
var fs = require('fs');
var express = require('express');

var app = express();
var user = require('./modules/user');
var item = require('./modules/item');
var upload = require('./modules/upload');
var authorization = require('./modules/authorization');

//MongoDB connection
var mongoose=require('mongoose');
var dbUri = "mongodb://localhost/272Proj";
mongoose.connect(dbUri);

var db = mongoose.connection; //instance of the connected db

db.on('error',function(err){	//upon connection failure
	console.log("DB Connection Error: " + err);
});

db.once('open',function(){		//upon connection
	console.log("Successfully connected to mongoDB");
});

process.on('SIGINT', function() {  	//upon node process end
  mongoose.connection.close(function () {
    console.log('Mongoose default connection ' +
                'disconnected through app termination');
    process.exit(0);
  });
});
//MongoDB connection end

app.use('/js',express.static(__dirname + '/js'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/data',express.static(__dirname + '/data'));

app.use('/user',user);
app.use('/*',authorization);	//must be below /user

app.use('/img',express.static(__dirname + '/img'));

app.use('/item',item);
app.use('/upload',upload);
app.use('/img',express.static(__dirname + '/img'));

app.get('/', function (req, res) {
	res.sendfile('view.html')
});

app.get('/login', function (req, res) {
	res.sendfile('login.html')
});

app.get('/product', function (req, res) {
	res.sendfile('product.html')
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
