#!/usr/bin/env node

var SSH = require('simple-ssh');
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

function getSSHClient(scope) {
	return scope._SSH
}

function _ensureSSHConnect(scope) {
	if (scope._SSH == null)
		return _errorExit('connection error! Please check command order again. Ensure that your ssh info is correct')
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
	var scope = {}

	inpCommandList.forEach(itm => {
		var action = itm.action
		var func = ACTION_MAPPING[action]

		if (func == null)
			return _errorExit('command type invalid ' + action)


		func(itm, scope)
	})

	//where magic happen!
	var ssh = scope._SSH
	ssh.start()
}

function actionConnect(itm, scope) {
	var ssh = new SSH(itm.args);
	ssh.on('error', _errorExit)
	ssh.on('ready', () => {
		console.log("Connected!")
	});

	scope._SSH = ssh
}

function actionCmd(itm, scope) {
	_ensureSSHConnect(scope)

	var ssh = getSSHClient(scope)

	console.log(itm.input)

	var options = {
		out: function(stdout) {
			console.log("[out]", stdout);
		},
		start: function(stdout) {
			console.log("[start]",stdout);
		},
		err: function(stdout) {
			console.log("[err]",stdout);
		},
		exit: function(stdout) {
			console.log("[exit]",stdout);
		}
	}

	if (itm.input != null) {
		// options.in = itm.input;
		options.pty = true
	}

	//Register cmd, redirect stdin and out
	ssh.exec(itm.cmd, options)
}

function actionExit(itm, scope) {
	_ensureSSHConnect(scope)

	var ssh = getSSHClient(scope)

	ssh.exec('exit 0', {
		out: function(stdout) {
			console.log(stdout);
		}
	})
}