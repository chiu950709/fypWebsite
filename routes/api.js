var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var fs = require('file-system');

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

//compile
router.post('/compile', function(req, res){
	var code = req.body.code;
	var output;
	var output;
	console.log(code);
	fs.writeFile('Temp.java', code, function (err) {
	  if (err) throw err;
	  console.log('File Saved!');
	  compile_temp(function(response){
	  	console.log(response);
		res.setHeader("content-type","text/html");
		res.send(response);
	  	});
	});
});

function compile_temp(callback){
	var process = require('child_process');
	var astr = "";
	var bstr = "";

	var options={encoding:'utf8'};
	var javac  = process.spawn('javac', ['Temp.java'],options);

	javac.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});

	javac.on('close', function (code) {
	  console.log('child process exited with code ' + code);
	});

	console.log('Spawned child pid: ' + javac.pid);

	var java  = process.spawn('java', ['Temp'],options);
	var response = {};

	java.stdout.on('data', function(data) {
	    astr = astr + data.toString();
	    response.out = astr;
	});

	java.stderr.on("data", function (data) {
		bstr = bstr + data.toString();
		response.err = astr;
	});

	java.once('close', function(){
	   callback(response);
	});

	
}



module.exports = router;
