var jsonData=require('./data/jobs.json');//bad practice but i dont fking care in this moment
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection('test', {w:1}, function(err, collection) {
  });
  db.collection("test",function(err, collection) {
  	if (err) throw err;
  	collection.insert(jsonData.jobs, function(err, result) {
  		if (err) throw err;
  		console.log('insert success')
  	});
  });
  db.close();
});