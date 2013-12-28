var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , doges = {}
  , online = [0, 0];

try {

app.use(express.static(__dirname + '/cli/'));

var server = http.createServer(app);
server.listen(port);

console.log('wow http on %d', port);

var wss = new WebSocketServer({server: server});

wss.on('connection', function (socket) {
	console.log("wow doge is connect");

	socket.on('message', function (data) {
		var data = JSON.parse(data);

		var date = new Date();
		doges[data.id] = {
			x: parseInt(data.mx),
			y: parseInt(data.my),
			n: escapeHtml(data.lb),
			t: date.getTime(),
			wow: data.wow
		};
	});

	var emitter = setInterval(emitDoges, 50);

	socket.on('close', function() {
		console.log('wow doge is disconnect');
		clearInterval(emitter);
	});

	function emitDoges() {
		socket.send(JSON.stringify(doges));
	}
});

function escapeHtml(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

} catch(e) {
	console.error(e);
}