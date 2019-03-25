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
router.get('/examquestion/:scope', function(req, res){
	var searchingCriteria = {};
	searchingCriteria.Scope = req.params.scope;
	search(searchingCriteria, function(result){
		res.setHeader("content-type","application/json");
		res.send(result);
	});
});
function search(searchingCriteria, callback){
	mongodb.connect(url, {userNewUrlParser: true}, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("exam").find(searchingCriteria).toArray(function(err,result){
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
	var class_identifier = ("public class ");
	var index1 = code.indexOf(class_identifier);
	index1 == -1 ? -1 : (index1 += class_identifier.length);
	var respondfail = true;
	
	if(index1 != -1){

		var index2 = code.indexOf("{",index1-1);
		//var index3 = code.indexOf(" ",index1-1);
		var class_name;

		if(index2 != -1){
			class_name = code.substring(index1,index2);
			
			console.log(class_name);
			var index3 = class_name.indexOf(" ");
			if(index3 != -1){
				class_name = class_name.substring(0,index3);
			}
			var index4 = class_name.indexOf("\t");
			if(index4 != -1){
				class_name = class_name.substring(0,index4);
			}
			respondfail = false;
		}	
		/*else if(index3 != -1){
			class_name = code.substring(index1,index3);
			respondfail = false;
		}*/
		
		if(respondfail == false){
			fs.writeFile(class_name + '.java', code, function (err) {
			  if (err) throw err;
			  console.log('File Saved as ' + class_name+'.java');
			  compile_temp(class_name ,function(response){
				res.setHeader("content-type","application/json");
				res.send(response);
				removeFile(class_name);
			  	});
			});
		}
	}
	if(respondfail){
		var response = {};
		response.output = 'Cannot identify class name.';
		res.setHeader("content-type","tapplication/json");
		res.send(response);
	}
});

function compile_temp(className,callback){
	console.log("compileJava()");
	compileJava(className,function(response){
		var jvm = "Picked up JAVA_TOOL_OPTIONS: -Xmx300m -Xss512k -XX:CICompilerCount=2 -Dfile.encoding=UTF-8 \n";
		if(response.compileErr != undefined){
			if(response.compileErr.indexOf(jvm) != -1 &&  response.compileErr.length == jvm.length){
				response.compileErr = undefined;
			}
		}
		if(response.compileErr == undefined){
			runJava(className,response,function(response){
			callback(response);
			})
		}else{
			console.log(response);
			callback(response);
		}
	});

}

function removeFile(fileName){
	
	var fs = require('fs');
	var filePath = process.cwd() + "/" + fileName;
	console.log(filePath);
	//fs.unlink
}

async function compileJava(className,callback){

	var process = require('child_process');
	var bstr = "";
	var response = {};

	var options={encoding:'utf8'};
	var javac  = process.spawn('javac', [className+'.java'],options);

	javac.stderr.on('data', function (data) {
		  bstr = bstr + data.toString();
		  response.compileErr = bstr;
	});


	javac.on('close', function (code) {
		callback(response);
	});

}

async function runJava(className,response,callback){
	console.log("runJava()");

	var process = require('child_process');

	var options={encoding:'utf8'};
	var astr = "";
	var bstr = "";

	var java  = process.spawn('java', [className],options);

	java.stdout.on('data', function(data) {
	    astr = astr + data.toString();
	    response.out = astr;
	});

	java.stderr.on('data', function (data) {
	if(data.toString().indexOf("Picked up JAVA_TOOL_OPTIONS") != -1){
		}else{
			bstr = bstr + data.toString();
			response.runtimeErr = bstr;
		}
	});

	java.once('close', function(){
		callback(response);
	});

}



module.exports = router;
