var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var fs = require('file-system');
var async = require('async');

//const fsp = require('fs').promises;


var url = "mongodb+srv://dbadmin:dbadmin@cluster0-fruhy.mongodb.net/test?retryWrites=true"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



//find/search
router.get('/examquestion/:scope', function(req, res){
	var searchingCriteria = {};
	searchingCriteria.Scope = req.params.scope;
	searchExam(searchingCriteria, function(result){
		res.setHeader("content-type","application/json");
		console.log(result[0]);
		res.send(result);
	});
});
function searchExam(searchingCriteria, callback){
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

///////////////////////////////////////////////////////////
//findTemplate
router.get('/templateQuestion/:scope', function(req, res){

	var searchingCriteria = {};
	var questionJsonArray = [];
	var outputAllQuestion = [];
	searchingCriteria.Scope = req.params.scope;

	search(searchingCriteria, function(result){
		
		randomInt(result, function(outputAllQuestion){

			compileTemp(outputAllQuestion, res);

		});

		
	});
});

//Get data from mongoDB
function search(searchingCriteria, callback){
	mongodb.connect(url, {userNewUrlParser: true}, function(err, client){
		console.log("Connected");
		client.db("fyp").collection("template").find(searchingCriteria).toArray(function(err,result){
			callback(result);
		});
	});
}

//Function for search 
function randomInt(array, callback){
	var randomStr = ["Hello World!", "Welcome to Java World!", "Hong Kong no IT!", "Come and Join us as being a IT dog!", 
						"Every project would have a free rider groupmate and you cannot avoid him!", "Winner winner, chicken dinner",
						"The Open University of Hong Kong", "Hope that you enjoy learning Java",
						"How come a student can take all pass with no subject skills"];

	var strType = ["indexOf(substring)", "substring(randomStrInt1, randomStrInt2)", "length", "charAt(randomStrInt1)", "contains(substring)"];
	var outputAllQuestion = [];	
	outputAllQuestion = [array.length];
		var code = "";

		//Read all question template and put all in "outputAllQuestion" array
		for(var jsonLength=0; jsonLength<array.length; jsonLength++){

			var forMCwithNoCompile = {};

			var lengthOfStr;
			var randStr;

			var fucOfStr;

			code = array[jsonLength].Demo;
			type = array[jsonLength].Type;

			//For String
			if(code.includes("randomString1")){

				var genString = Math.floor((Math.random()*90)+1);

					if(genString > 80){

						code = code.replace("randomString1", "\""+randomStr[8]+"\"");
						lengthOfStr = randomStr[8].length;
						randStr = randomStr[8];

					}else if(genString > 70){

						code = code.replace("randomString1", "\""+randomStr[7]+"\"");
						lengthOfStr = randomStr[7].length;
						randStr = randomStr[7];

					}else if(genString > 60){

						code = code.replace("randomString1", "\""+randomStr[6]+"\"");
						lengthOfStr = randomStr[6].length;
						randStr = randomStr[6];

					}else if(genString > 50){

						code = code.replace("randomString1", "\""+randomStr[5]+"\"");
						lengthOfStr = randomStr[5].length;
						randStr = randomStr[5];

					}else if(genString > 40){

						code = code.replace("randomString1", "\""+randomStr[4]+"\"");
						lengthOfStr = randomStr[4].length;
						randStr = randomStr[4];

					}else if(genString > 30){

						code = code.replace("randomString1", "\""+randomStr[3]+"\"");
						lengthOfStr = randomStr[3].length;
						randStr = randomStr[3];

					}else if(genString > 20){

						code = code.replace("randomString1", "\""+randomStr[2]+"\"");
						lengthOfStr = randomStr[2].length;
						randStr = randomStr[2];

					}else if(genString > 10){

						code = code.replace("randomString1", "\""+randomStr[1]+"\"");
						lengthOfStr = randomStr[1].length;
						randStr = randomStr[1];

					}else if(genString > 0){

						code = code.replace("randomString1", "\""+randomStr[0]+"\"");
						lengthOfStr = randomStr[0].length;
						randStr = randomStr[0];

					}

					if(code.includes("randomType")){

						var genType = Math.floor((Math.random()*50)+1);

						if(genType > 40){

							var num_one = Math.floor((Math.random()*lengthOfStr));
							var num_two = Math.floor((Math.random()*lengthOfStr));
							var randCorrectAnswer = Math.floor((Math.random()*100)+1);
							var previewStr;

							code = code.replace("randomType", strType[4]);
							if(randCorrectAnswer > 50){
								if(num_one > num_two){
									previewStr = randStr.substring(num_two, num_one);
								}else{
									previewStr = randStr.substring(num_one, num_two);
								}
							}else if(randCorrectAnswer > 0){
								if(num_one > num_two){
									previewStr = randomStr[Math.floor((Math.random()*8))].substring(num_two, num_one);
								}else{
									previewStr = randomStr[Math.floor((Math.random()*8))].substring(num_one, num_two);
								}
							}
							code = code.replace("substring", previewStr);
							array[jsonLength].Answer = randStr.includes(previewStr).toString();
							
							if(type == "MCwithNoCompile"){
								var choices = [array[jsonLength].Answer, (!randStr.includes(previewStr)).toString()];
								array[jsonLength].Choices = choices;
								array[jsonLength].QuestionType = "MC";
							}else{
								array[jsonLength].QuestionType = "FillIn";
							}

						}else if(genType > 30){

							var index = Math.floor((Math.random()*lengthOfStr));
							code = code.replace("randomType", strType[3]);
							code = code.replace("randomStrInt1", index);
							array[jsonLength].Answer = randStr.charAt(index).toString();

							if(type == "MCwithNoCompile"){
								var choices = [array[jsonLength].Answer, randStr.charAt(Math.floor((Math.random()*lengthOfStr))).toString(), randStr.charAt(Math.floor((Math.random()*lengthOfStr))).toString()];
								array[jsonLength].Choices = choices;
								array[jsonLength].QuestionType = "MC";
							}else{
								array[jsonLength].QuestionType = "FillIn";
							}


						}else if(genType > 20){

							code = code.replace("randomType", strType[2]);
							array[jsonLength].Answer = lengthOfStr.toString();

							if(type == "MCwithNoCompile"){
								var choices = [array[jsonLength].Answer, (lengthOfStr-1).toString(), (lengthOfStr+1).toString()];
								array[jsonLength].Choices = choices;
								array[jsonLength].QuestionType = "MC";
							}else{
								array[jsonLength].QuestionType = "FillIn";
							}



						}else if(genType > 10){

							code = code.replace("randomType", strType[1]);
							var num_one = Math.floor((Math.random()*lengthOfStr));
							var num_two = Math.floor((Math.random()*lengthOfStr));
							if(num_one > num_two){
								code = code.replace("randomStrInt1", num_two);
								code = code.replace("randomStrInt2", num_one);
								array[jsonLength].Answer = randStr.substring(num_two, num_one);
								
								if(type == "MCwithNoCompile"){
									var choices = [array[jsonLength].Answer.toString(), randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length))).toString(),
									randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length))).toString(),
									randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length))).toString()];
									array[jsonLength].Choices = choices;
									array[jsonLength].QuestionType = "MC";
								}else{
									array[jsonLength].QuestionType = "FillIn";
								}


							}else{
								code = code.replace("randomStrInt1", num_one);
								code = code.replace("randomStrInt2", num_two);
								array[jsonLength].Answer = randStr.substring(num_one, num_two);
								
								if(type == "MCwithNoCompile"){
									var choices = [array[jsonLength].Answer.toString(), randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length))).toString(),
									randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length))).toString(),
									randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length))).toString()];
									array[jsonLength].Choices = choices;
									array[jsonLength].QuestionType = "MC";

								}else{
									array[jsonLength].QuestionType = "FillIn";
								}
							}


						}else if(genType > 0){

							var num_one = Math.floor((Math.random()*lengthOfStr));
							var num_two = Math.floor((Math.random()*lengthOfStr));
							var previewStr;

							code = code.replace("randomType", strType[4]);
							if(num_one > num_two){
								previewStr = randStr.substring(num_two, num_one);
							}else{
								previewStr = randStr.substring(num_one, num_two);
							}
							code = code.replace("substring", previewStr);

							array[jsonLength].Answer = randStr.indexOf(previewStr).toString();
							
							if(type == "MCwithNoCompile"){
								var choices = [array[jsonLength].Answer.toString(), randomStr[Math.floor((Math.random()*8))].indexOf(randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)))).toString(),
								randomStr[Math.floor((Math.random()*8))].indexOf(randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)))).toString(), 
								randomStr[Math.floor((Math.random()*8))].indexOf(randomStr[Math.floor((Math.random()*8))].substring(Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)), Math.floor((Math.random()*randomStr[Math.floor((Math.random()*8))].length)))).toString()];
								array[jsonLength].Choices = choices;
								array[jsonLength].QuestionType = "MC";
							}else{
								array[jsonLength].QuestionType = "FillIn";
							}


						}
					}
			}


			//For Calculation
			if(code.includes("randomInt1")){
				code = code.replace("(randomInt1)", Math.floor((Math.random()*50)+1));
			}
			if(code.includes("randomInt2")){
				code = code.replace("(randomInt2)", Math.floor((Math.random()*50)+1));
			}
			if(code.includes("randomInt3")){
				code = code.replace("(randomInt3)", Math.floor((Math.random()*50)+1));
			}
			if(code.includes("randomInt4")){
				code = code.replace("(randomInt4)", Math.floor((Math.random()*50)+1));
			}
			if(code.includes("randomDouble1")){
				code = code.replace("(randomDouble1)", Math.round(((Math.random()*50)+1) * 100)/100);
			}
			if(code.includes("randomDouble2")){
				code = code.replace("(randomDouble2)", Math.round(((Math.random()*50)+1) * 100)/100);
			}
			
			array[jsonLength].Demo = code;
			//console.log(code);
		}
	console.log(array);
	callback(array);

}
//////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////
async function compile_temp(className,callback){
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
	console.log("runJava()"+className);

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


///////////////////////////////////////////////////
async function compileTemp(array, res){

	var questionJson = [];
	var questionNumber = 0;


	for(const item of array){
		questionNumber += 1;
		if(!item.Demo.includes("public")){						
			await forNoneCompile(item, questionNumber, function(result){
				questionJson.push(result);
				if(questionJson.length == array.length){
					res.setHeader("content-type","application/json");
					res.send(questionJson);
				}			
			});	


		}else{

			await writeProgram(item, questionNumber, function(result){
				questionJson.push(result);
				if(questionJson.length == array.length){
					res.setHeader("content-type","application/json");
					res.send(questionJson);
				}			
			});	
		}		
	}

}
async function forNoneCompile(item, questionNumber, callback){
	await delay();
	var notNeedComplete = {};
	notNeedComplete.QuestionNumber = questionNumber;
	notNeedComplete.QuestionTitle = item.Demo;
	notNeedComplete.Answer = item.Answer;
	if(item.QuestionType == "MC"){
		notNeedComplete.Choices = item.Choices;
		notNeedComplete.QuestionType = "MC";
	}else{
		notNeedComplete.QuestionType = "FillIn";
	}
	callback(notNeedComplete);
}

async function writeProgram(item, questionNumber, callback){
	await delay();
			var code = item.Demo;
			var type = item.Type;
			var class_identifier = ("public class ");
			var index1 = code.indexOf(class_identifier);
			index1 == -1 ? -1 : (index1 += class_identifier.length);
			var respondfail = true;
			
			if(index1 != -1){

				var index2 = code.indexOf("{",index1-1);
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

					fs.writeFile(class_name + '.java', code, function (err) {
					  if (err) throw err;

						  compile_temp(class_name ,function(response){
						  	var aQuestion = {};
						  	var correctAnswer = "";
							aQuestion.QuestionNumber = questionNumber;				
							aQuestion.QuestionTitle = code;
							correctAnswer = response.out.replace("\n","");
							aQuestion.Answer = correctAnswer;
							if(type == "MC"){
								if(code.includes("double")){
									choices = [correctAnswer, (Math.round(((Math.random()*50)+1) * 100)/100).toString(), (Math.round(((Math.random()*50)+1) * 100)/100).toString(), (Math.round(((Math.random()*50)+1) * 100)/100).toString()];
								}else{
									choices = [correctAnswer, Math.floor((Math.random()*50)+1).toString(), Math.floor((Math.random()*50)+1).toString(), Math.floor((Math.random()*50)+1).toString()];
								}
								aQuestion.QuestionType = "MC";
								aQuestion.Choices = choices;
							}else{
								aQuestion.QuestionType = "FillIn";
							}
							callback(aQuestion);
							removeFile(class_name);
					  	});
					});
				}	
			}

}
function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}



module.exports = router;
