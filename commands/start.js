var fs = require('fs'),
	path = require('path'),
	open = require('open'),
	errorCode = require('rest/interceptor/errorCode'),
	timeout = require('rest/interceptor/timeout'),
	retry = require('rest/interceptor/retry'),
	client = timeout(
				retry(errorCode(), {max: 200}),
				{timeout: 1000}
	),
	spawn = require('child_process').spawn;

function exec(options) {
	options.port = options.port || 8000;
	options.url = "http://localhost:" + options.port;
	ping(options).then(
		function(response){
			console.log("Server already running at %s", options.url);
			var url = options.url;
			if (options.path) {
				url += options.path;
			}
			open(url);
		},
		function(error){
			start(options);
		}
	);
}

function ping(options) {
	return client({ path: options.url+"/serv/status" });
}

function start(options) {
	console.log("Starting server at %s", options.url);
	var url = options.url;
	var logdir = options.logdir?options.logdir+'/serv.log':'./serv.log';
	var out = fs.openSync(logdir, 'a');
	var	err = fs.openSync(logdir, 'a');
	var args = [ path.resolve(path.dirname(module.filename), '../static-server.js'), options.port ],
		child;

		if (options.cwd) {
			args.push(options.cwd);
		}

		child = spawn('node', args, {
			detached: true,
			stdio: ['ignore', out, err]
		});

	child.unref();

	ping(options).then(
		function(response){
			if (options.path) {
				url += options.path;
			}
			if (!options.suppressOpen) {
				open(url);
			}
		},
		function(error){
			console.log("Server failed to start - check serv.log for more information.");
		}
	);
}

module.exports.exec = exec;
