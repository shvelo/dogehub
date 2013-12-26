var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , dawgs = {};

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
			x: data.mx,
			y: data.my,
			n: data.lb,
			t: date.getTime(),
			a: true
		};
	});

	var emiter = setInterval(emitDawgs, 50);
	var police = setInterval(killDawgs, 2000);

	socket.on('close', function() {
		console.log('websocket connection closed');
		clearInterval(emiter);
		clearInterval(police);
	});

	function emitDawgs() {
		socket.send(JSON.stringify(dawgs));
	}

	function killDawgs() {
		var date = new Date();
		console.log(dawgs);
		for (var key in dawgs) {
			var obj = dawgs[key];
			for (var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					if (prop == "t" && obj[prop] < date.getTime() - 200) {
						dawgs[key] = null;
					} else if (prop == "t" && obj[prop] < date.getTime() - 100) {
						dawgs[key][a] = false;
					}
				}
			}
		}
	}

});