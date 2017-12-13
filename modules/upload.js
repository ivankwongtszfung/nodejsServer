var express = require('express');
var multer = require('multer');
var crypto = require('crypto');
var path = require('path');

var router = express.Router();

var storage = multer.diskStorage({
	destination:'./uploads/',
	filename:function(req,file,cb){
		crypto.pseudoRandomBytes(16,function(err,raw){
			if(err) return cb(err)
			cb(null, raw.toString('hex') + path.extname(file.originalname))
		})
	}
});

var upload = multer({storage: storage});	//specify upload location and extension

//handling single file upload
router.post('/photoUpload',upload.single('logo'),function(req,res,next){
	if(req.file==undefined)
		res.status(401).json({success:false, message:'No request file found'});
	else{
		if(req.file.mimetype.slice(0,5) == 'image'){
			res.send(req.file);
		}else{
			res.send({success:false, message:'Not a image file'});
		}
	}
});

module.exports = router;