#!/usr/bin/env node

var SSH = require('./sshHelper.js');
var program = require('commander');
var fs = require('fs')

//---------------------------------------------------------//
//	Commandline arguments
//---------------------------------------------------------//
program
	.version('0.0.1')
	.option('-d, --debug', 'debug log enable')
	.arguments('<input>')
	.action(function(input) {
		jsonInput = input;
	});

program.parse(process.argv);

if (typeof jsonInput === 'undefined') {
	return _errorExit('no input given!');
}


//---------------------------------------------------------//
//	Utils
//---------------------------------------------------------//
function parseJson(data) {
	try {
		return JSON.parse(data)
	} catch (ex) {
		return null
	}
}

function _log() {
	if (program.debug)
		console.log.apply(null, arguments)
}

function _errorExit(msg) {
	console.error('[Error] ', msg);
	process.exit(1);
}

//---------------------------------------------------------//
//	Input reader
//---------------------------------------------------------//

fs.readFile(jsonInput, (err, data) => {
	if (err) {
		return _errorExit('file not found');
	}

	var inpCommandList = parseJson(data)

	_log(inpCommandList)

	if (inpCommandList == null)
		_errorExit("input file invalid json format")

	launch(inpCommandList)
});

//---------------------------------------------------------//
//	Processing
//---------------------------------------------------------//

var ACTION_MAPPING = {
	'connect': actionConnect,
	'command': actionCmd,
	'exit': actionExit
}

function launch(inpCommandList) {
	var scope = {
		cmd: [],
		onComplete: (text) => {
			console.log(text)
		}
	}

	inpCommandList.forEach(itm => {
		var action = itm.action
		var func = ACTION_MAPPING[action]

		if (func == null)
			return _errorExit('command type invalid ' + action)


		func(itm, scope)
	})

	//where magic happen!
	SSH(scope)
}

function actionConnect(itm, scope) {
	Object.assign(scope, itm.args);
}

function actionCmd(itm, scope) {
	var cmdList = scope.cmd || []
	cmdList.push(itm.cmd)
}

function actionExit(itm, scope) {

}