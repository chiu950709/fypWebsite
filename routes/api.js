var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;

var url = "mongodb+srv://dbadmin:dbadmin@cluster0-fruhy.mongodb.net/test?retryWrites=true"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//find/search
router.get('/testing', function(req, res){
	search(function(result){
		res.setHeader("content-type","application/json");
		res.send(result);
	});
});
var search = function(callback){
	mongodb.connect(url, {userNewUrlParser: true}, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("exam").find({}).toArray(function(err,result){
			callback(result);
		});
	});
}

//insert
router.post('/insert', function(req, res){
	var query = {};
	query.name = req.body.name;
	query.password = req.body.password;
	insert(query, function(result){
		var response = {};
		if(result){
			response.status = 'ok';
			res.setHeader("content-type","application/json");
			res.send(response);
		}else{
			response.status = 'fail';
			res.setHeader("content-type","application/json");
			res.send(response);
		}
	});
});
function insert(query, callback){
	mongodb.connect(url, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("user").insertOne(query, function(err,result){
			callback(result);
		});
	});
}
module.exports = router;
