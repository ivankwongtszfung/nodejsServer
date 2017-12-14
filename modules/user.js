var http = require("http");
var fs = require('fs');
var express = require('express');
var router = express.Router();
var md5 = require( 'md5' );
var json2csv = require('json2csv');
var path = require('path');
var jwt = require('jsonwebtoken');
var authorization = require('./authorization');

var secretKey = "ilovecjcjcjcjcj";//jwt webtoken secret

//bodyparser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));

var mongoose=require('mongoose');
var users = require('./user_model.js');

router.get('/hi',function(req,res){
	res.send("hi from login api");
});

router.post('/login',function(req,res){
	console.log(req.body);
	var username = req.body['username'];
	var password = req.body['password'];

	if (req.body.username === undefined || req.body.password === undefined) {
    	res.status(401).json({success:false, message:'Missing Username or Password'});
    	return;
  	} else{
		users.find({Username: username, Password: md5(password).toUpperCase()},function(err,results){
			if(err){
				console.log(err);
				res.status(500).json({success:false, message:'Server Error'});
				return;
			}

			if(results.length > 0){
				var token = jwt.sign(results[0].toObject(), secretKey, {
					expiresIn: 60*60*24
				});
				res.status(200).json({success:true, message: 'Enjoy your token', token: token});
				return;
			}else{
				res.status(401).json({success:false, message:'Incorrect username or passowrd'});
				return;
			}
		});
	}
});

router.get('/verifyToken', (req, res) => {
  jwt.verify(req.headers['authorization'], secretKey, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(401).json(err);
    } else {
      console.log(decoded);
      res.json(decoded);
    }
  })
});


router.use('/*',authorization);	//Must be below login and vertifyToken

router.get('/showRedeemedItem',function(req,res){
	var username = req.query['username'];
	users.find({Username: username},function(err,result){
		if(err){
			res.status(500).json({success:false, message:'Server Error'});
			return;
		}
		if(result.length > 0){
			res.status(200).json(result[0].Redeemed);
		}else{
			res.status(401).json({success:false, message:'No such user'});
		}
	});
	return;
});

router.get('/showAllRedeemedItem',function(req,res){
	var redeemedList = [];
	users.find({},'Username Redeemed',function(err,result){
		if(err){
			res.status(500).json({success:false, message:'Server Error'});
			return;
		}else if(result.length > 0){
			for(var i=0;i<result.length;i++){
				var arr = result[i].Redeemed;
				var username = result[i].Username;
				for(var j=0;j<arr.length;j++){
					var obj = {};
					obj.Username = username;
					obj._id = arr[j]._id;
					obj.Title = arr[j].Title;
					obj.Token_value = arr[j].Token_value;
					obj.Redeemed_timestamp = arr[j].Redeemed_timestamp;
					redeemedList.push(obj);
				}
			}
			//console.log(redeemedList);
			res.status(200).json(redeemedList);
		}
	});
	return;
});

router.get('/generateRedeemedCSV',function(req,res){
	var redeemedList = [];
	users.find({},'Username Redeemed',function(err,result){
		if(err){
			res.status(500).json({success:false, message:'Server Error'});
			return;
		}else if(result.length > 0){
			for(var i=0;i<result.length;i++){
				var arr = result[i].Redeemed;
				var username = result[i].Username;
				for(var j=0;j<arr.length;j++){
					var obj = {};
					obj.Username = username;
					obj._id = arr[j]._id;
					obj.Title = arr[j].Title;
					obj.Token_value = arr[j].Token_value;
					obj.Redeemed_timestamp = arr[j].Redeemed_timestamp;
					redeemedList.push(obj);
				}
			}
			//Generate CSV
			var fields = ['Username', '_id', 'Title', 'Token_value', 'Redeemed_timestamp'];

			var csv = json2csv({ data: redeemedList, fields: fields });

  			fs.writeFile('temp/file.csv', csv, function(err) {		//generate CSV file on server
  				if (err) throw err;
  				console.log('file generated');
  				res.sendFile(path.join(__dirname,'../temp','file.csv'));	//send CSV file
			});
		}
	});
	return;
});

module.exports = router;
