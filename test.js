var process = require('child_process');

var options={encoding:'utf8'};
var javac  = process.spawn('javac', ['HelloWorld.java'],options);

javac.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

javac.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

console.log('Spawned child pid: ' + javac.pid);

var java  = process.spawn('java', ['HelloWorld'],options);

java.stdout.on('data', function(data) {
    console.log(data.toString());
});

java.stderr.on("data", function (data) {
    console.log(data.toString());
});