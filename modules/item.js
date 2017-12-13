var express = require('express');
var router = express.Router();

//bodyparser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));

//MongoDB
var mongoose=require('mongoose');
var items = require('./item_model.js');
var users = require('./user_model.js');

router.get('/hi',function(req,res){
	res.send("hi from item api");
});

//retrieve Items based on items Creation timestamp and redeem cost
router.get('/listItem',function(req,res){
	var sortCriteria = req.query['sortCriteria'];
	var ascending = req.query['ascending'];

	if(sortCriteria === undefined){
		res.status(401).json({success:false, message:'Missing sort criteria'});
		return;
	}

	if(ascending == "false"){
		ascending = false;
	}else{
		ascending = true; //default ascending sort
	}

	var sortQuery = "";

	if(sortCriteria == "token"){
		if(ascending == true)
			sortQuery = {Token_value: 1};
		else
			sortQuery = {Token_value: -1};
	}else if(sortCriteria == "timestamp"){
		if(ascending == true)
			sortQuery = {Creation_timestamp: 1};
		else
			sortQuery = {Creation_timestamp: -1};
	}else{
		res.status(401).json({success:false, message:'Wrong sort criteria (token/timestamp)'});
		return;
	}

	items.find({},'_id Title Token_value Available_quantity Creation_timestamp',
		function(err,results){
			if(err){
				console.log(err);
				res.status(500).json({success:false, message:'Server Error'})
				return;
			}
			if(results.length > 0){
				res.json({success:true, message: results});
				return;
			}else{
				res.json({success:true, message:'No item found'});
				return;
			}
		}
	).sort(sortQuery);
});

//Select Item
router.get('/selectItem',function(req,res){
	var id = req.query['id'];
	var objectId = mongoose.Types.ObjectId(id);

	items.find({_id: objectId}, '_id Title Description Image Token_value Available_quantity Tags Creation_timestamp',
		function(err,result){
			if(err){
				res.status(500).json({success:false, message:'Server Error'});
				return;
			}
			if(result.length > 0){
				res.json({success:true, message: result});
				return;
			}else{
				res.json({success:true, message:'No item found'});
				return;
			}
		});
});

//Insert Item
router.post('/insertItem',function(req,res){
	var title = req.body["title"];
	var description = req.body['description'];
	var token_value = req.body['token_value'];
	var available_quantity = req.body['available_quantity'];
	var tags = req.body['tags[]'];

	var newItem = new items({
		Title: title, Description: description, Image: "",Token_value: token_value, Available_quantity: available_quantity, Tags: tags, Creation_timestamp: Date.now()
	});

	newItem.save(function(err){
		if(err){
			res.status(500).json({success:false, message:'Server Error'});
			return;
		}
		res.json({success:true, message:'Successfully inserted!'});
		return;
	});
});

//Update Item
router.post('/updateItem',function(req,res){
	var id = req.body['id'];
	var title = req.body["title"];
	var description = req.body['description'];
	var token_value = req.body['token_value'];
	var available_quantity = req.body['available_quantity'];
	var tags = req.body['tags[]'];
	var objectId = mongoose.Types.ObjectId(id);

	var condition = {_id: objectId},
		update = {$set:{Title: title, Description: description, Token_value: token_value, Available_quantity: available_quantity, Tags:tags}};
	items.update(condition, update, function(err,raw){
		if(err){
			res.status(500).json({success:false, message:'Server Error'});
			return;
		}else{
			res.json({success:true, message:raw});
			return;
		}
	});
});

//delete Item
router.post('/deleteItem',function(req,res){
	var id = req.body['id'];
	var objectId = mongoose.Types.ObjectId(id);

	items.remove({_id: objectId},function(err,raw){
		if(err){
			res.status(500).json({success:false, message:'Server Error'});
			return;
		}else{
			res.json({success:true, message:raw});
			return;
		}
	});
});

//redeem Item
router.post('/redeemItem',function(req,res){
	var id = req.body['id'];
	var objectId = mongoose.Types.ObjectId(id);
	var username = req.body['username'];

	items.find({_id: objectId}, '_id Title Description Image Token_value Available_quantity Tags Creation_timestamp',
		function(err,result){
			if(err){
				res.status(500).json({success:false, message:'Server Error'});
			}

			if(result.length > 0){	//if target item found
				if(result[0].Available_quantity<1){	//if no remaining left
					res.json({success:false, message:'The item has no available quantity'});
					return;
				}
				users.find({Username: username},function(err,userResult){		//Get user balance
					if(err){
						res.status(500).json({success:false, message:'Server Error'});
					}else{
						if(userResult.length<1){	//if no such user
							res.json({success:false, message:'No such user'});
							return;
						}
						var userBalance = userResult[0].Balance;
						if(userBalance<result[0].Token_value){		//if user not enough credit
							res.json({success:false, message:'Not enough credit'});
							return;
						}
						var	update = {$push:{"Redeemed" : {_id: result[0]._id, Title:result[0].Title, Token_value: result[0].Token_value, Redeemed_timestamp: Date.now()}}, //keep redeem record
							  $set:{'Balance' : userBalance - result[0].Token_value}}; //deduct user balance
						users.update({Username: username},update,function(err,raw){
							if(err){
								res.status(500).json({success:false, message:'Server Error'});
							}else{
								//available quantity of item - 1
								items.update({_id: objectId},{$set:{'Available_quantity': result[0].Available_quantity - 1}}, function(err,raw){
									if(err){
										res.status(500).json({success:false, message:'Server Error'});
										return;
									}else{
										res.json({success:true, message:raw});	//return redeem success
									}
								});
							}
						});
					}
				});
			}else{
				res.json({success:false, message:'No item found'});
			}
		}
	);
});

module.exports = router;