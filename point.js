var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , dawgs = {}
  , online = [0, 0];

app.use(express.static(__dirname + '/cli/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});

wss.on('connection', function (socket) {

	socket.on('message', function (data) {
		var data = JSON.parse(data);
		console.log(data);
		var date = new Date();
		dawgs[data.id] = {
			x: parseInt(data.mx),
			y: parseInt(data.my),
			n: escapeHtml(data.lb),
			t: date.getTime(),
			a: true
		};
	});

	var emiter = setInterval(emitDawgs, 50);
	var police = setInterval(killDawgs, 1000);

	socket.on('close', function() {
		console.log('websocket connection closed');
		clearInterval(emiter);
		clearInterval(police);
	});

	function emitDawgs() {
		socket.send(JSON.stringify(dawgs));
	}

	function killDawgs() {
		var date = new Date(),
			on = 0,
			act = 0;
		console.log(dawgs);
		loopMain: for (var key in dawgs) {
			var obj = dawgs[key];
			loopInner: for (var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					if (prop == "t" && obj[prop] < date.getTime() - 30000) {
						dawgs[key] = null;
						continue loopMain;
					} else if (prop == "t" && obj[prop] < date.getTime() - 5000) {
						dawgs[key].a = false;
						act++;
					}
				}
			}
			on++;
		}
		online = [--on, act];
		dawgs["stats"] = online;
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