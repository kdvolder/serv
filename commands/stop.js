var client = require('rest');

function exec(options) {
	var addr = 'http://localhost:' + options.port || 8000 + '/status';
	client({path: addr + '/status', method: 'PUT'}).then(
		function(response) {
            console.log('Server at %s shut down successfully.', addr);
        },
        function(response) {
            console.error('Error shutting down server.', response);
        }
	);
}

module.exports.exec = exec;