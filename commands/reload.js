var client = require('rest');

function exec(options) {
	client({ path: 'http://localhost:35729/reload?path='+options.path });
}

module.exports.exec = exec;