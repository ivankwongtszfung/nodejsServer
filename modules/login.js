var http = require("http");
var fs = require('fs');
var express = require('express');
var router = express.Router();
var md5 = require( 'md5' );

//bodyparser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));

var mongoose=require('mongoose');
var userSchema = mongoose.Schema({
        Username: String,
        Password: String
});
var users = mongoose.model('users', userSchema);

router.get('/hi',function(req,res){
	res.send("hi from login api");
});

router.post('/',function(req,res){
	var username = req.body['username'];
	var password = req.body['password'];

	if (req.body.username === undefined || req.body.password === undefined) {
    	res.status(401).json({success:false, message:'Missing Credentials'});
    	return;
  	} else{
		users.find({Username: username, Password: md5(password).toUpperCase()},function(err,results){
			if(err){
				console.log(err);
				res.status(500).json({success:false, message:'Server Error'});
				return;
			}

			if(results.length > 0){
				res.status(200).json({success:true, message:'Login Successfully'});
				return;
			}else{
				res.status(401).json({success:false, message:'Incorrect username or passowrd'});
				return;
			}
		});
	}
});

module.exports = router;
