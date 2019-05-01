var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


var url = "mongodb+srv://dbadmin:dbadmin@cluster0-fruhy.mongodb.net/test?retryWrites=true"


//Create User
router.post('/register', function(req, res){

	var userName = req.body.userName;
	var password = req.body.password;
	var nickName = req.body.nickName;

	var response = {};
	var checkUserName = {}
	var checkNickName = {}
	response.status = "";

	if(userName == undefined){
		response.status += 'Username cannot be empty!\n';
		res.setHeader("content-type","application/json");
		res.send(response);
	}else{
		checkUserName.userName = userName;
		searchUser(checkUserName, function(result){
			if(result){
				response.status += 'Username already taken!\n';
				res.setHeader("content-type","application/json");
				res.send(response);
			}else{
				if(nickName == undefined){
					response.status += 'Nickname cannot be empty!\n';
					res.setHeader("content-type","application/json");
					res.send(response);
				}else{
					checkNickName.nickName = nickName;
					searchUser(checkNickName, function(result){
						if(result){
							response.status += 'Nickname already taken!\n';
							res.setHeader("content-type","application/json");
							res.send(response);
						}else{
							if(password == undefined){
								response.status += 'Password cannot be empty!\n';
								res.setHeader("content-type","application/json");
								res.send(response);
							}else{
								var user = {}
								user.userName = req.body.userName;
								user.password = req.body.password;
								user.nickName = req.body.nickName;
								user.joinDate = new Date().toDateString();
								createUser(user, function(result){
									if(result){
										response.status = 'User account created';
										res.setHeader("content-type","application/json");
										res.send(response);
									}else{
										response.status = 'User account failed to create';
										res.setHeader("content-type","application/json");
										res.send(response);
									}
								});
							}
						}
					});
				}	
			}	
		});
	}
});

router.post('/login', function(req, res){
	var userName = req.body.userName;
	var password = req.body.password;

	var response = {};
	response.reason = "";
	var flag = true;

	if (userName == undefined){
		response.status = "Login Failed";
		response.reason += "Empty User Name\n";
		flag = false;
	}
	if (password == undefined){
		response.status = "Login Failed";
		response.reason += "Empty password\n";
		flag = false;
	}
	if(flag){
		userLogin(userName, password, function(result){
			if(result){
				response.status = "Login Successful";
				response.nickName = result.nickName;
				response.objID = result._id;
			}else{
				response.status = "Login Failed";
				response.reason = "Incorrect Username or Password"
			}
			res.setHeader("content-type","application/json");
			res.send(response);
		});

	}else{
		res.setHeader("content-type","application/json");
		res.send(response);
	}

});


function userLogin(name, pw, callback){
	console.log("userLogin()")
	mongodb.connect(url,{ useNewUrlParser: true }, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("user").findOne({userName : name , password : pw}, function(err,result){
			callback(result);
		});
	});
}
	

function createUser(user, callback){
	console.log("createUser()")
	mongodb.connect(url, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("user").insertOne(user, function(err,result){
			callback(result);
		});
	});
}

function searchUser(searchingCriteria, callback){
	console.log("searchUser()")
	mongodb.connect(url,{ useNewUrlParser: true }, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("user").findOne(searchingCriteria, function(err,result){
			callback(result);
		});
	});
}


module.exports = router;
