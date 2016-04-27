#! /usr/bin/env node

var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}

var listDirectory = getDirectories("./")
listDirectory.forEach((name) => {
	var cmd = `svnup ./${name}/`
	console.log(cmd)
	var child = exec(cmd, function(err, stdout, stderr) {
		console.log(stdout);
	});
})