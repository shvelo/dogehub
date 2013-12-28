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
			a: true,
			wow: data.wow
		};
	});

	var emitter = setInterval(emitDoges, 50);
	var police = setInterval(killDoges, 1000);

	socket.on('close', function() {
		console.log('wow doge is disconnect');
		clearInterval(emitter);
		clearInterval(police);
	});

	function emitDoges() {
		socket.send(JSON.stringify(doges));
	}

	function killDoges() {
		var date = new Date(),
			on = 0,
			act = 0;
		loopMain: for (var key in doges) {
			var obj = doges[key];
			if (obj == null) {
				continue loopMain;
			}
			loopInner: for (var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					if (prop == "t" && obj[prop] < date.getTime() - 30000) {
						doges[key] = null;
						continue loopMain;
					} else if (prop == "t" && obj[prop] < date.getTime() - 5000) {
						doges[key].a = false;
						act++;
					}
				}
			}
			on++;
		}
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