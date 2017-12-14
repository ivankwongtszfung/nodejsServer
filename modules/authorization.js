var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var secretKey = "ilovecjcjcjcjcj";//jwt webtoken secret

router.use('/*',function(req,res,next){	
	jwt.verify(req.headers['authorization'], secretKey, (err, decoded) => {
    	if (err) {
      		console.log(err);
      		res.status(401).json(err);
          return;
    	} else {
          if(decoded.name == "JsonWebTokenError"){
            res.json({"success":false,"message":"No authorization"});
            return;
          }else{
            next();
          }
    	}
  	})
});

module.exports = router;