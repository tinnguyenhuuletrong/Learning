var SSH2Shell = require('ssh2shell');

function doJob(options) {
	options = options || {}
	callbackCompleteFunc = options.onComplete || function() {}

	var sshObj = {
		server: {
			host: options.host,
			port: options.port,
			userName: options.user,
			password: options.pass,
			passPhrase: "",
			privateKey: ""
		},
		commands: options.cmd || [],
		msg: {
			send: function(message) {
				//console.log(message)
			}
		},
		debug: false,
		verbose: false,
		suPassSent: false, //used by commandProcessing to only send password once
		connectedMessage: "Connected",
		readyMessage: "Running commands Now",
		closedMessage: "Completed",
		asciiFilter: "[*]", //optional regular exression string
		diableColorFilter: false, //optional bollean 
		textColorFilter: "[*]", //optional regular exression string
	};

	var SSH = new SSH2Shell(sshObj);

	SSH.on('commandProcessing', function onCommandProcessing(command, response, sshObj, stream) {
		if (command == "su " + process.env.secondaryUser && response.indexOf("Password: ") != -1 && sshObj.suPassSent != true) {
			sshObj.commands.unshift("msg:Using secondary user password");
			//this is required to stop "bounce" without this the password would be sent multiple times
			sshObj.suPassSent = true;
			stream.write(process.env.secondUserPassword + "\n");
		} else if (command == "su root" && response.match(/:\s$/i) && sshObj.rootPassSent != true) {
			sshObj.commands.unshift("msg:Using root user password");
			//this is required to stop "bounce" without this the password would be sent multiple times
			sshObj.rootPassSent = true;
			stream.write(process.env.rootPassword + "\n");
		}
	});

	SSH.on('end', function onEnd(sessionText, sshObj) {
		this.emit("msg", sessionText)
	});

	SSH.connect(callbackCompleteFunc);
}

module.exports = doJob
