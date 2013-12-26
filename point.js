var express = require("express"),
	app = express(),
	io = require('socket.io').listen(server),
	dawgs = {};

server.listen(80);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/cli/dash.html');
});

io.sockets.on('connection', function (socket) {

	socket.emit('roger', {
		msg: 'roger'
	});

	socket.on('ohai', function (data) {
		console.log(
			"Random dawg with id " +
			data.id +
			" has joined :>");
	});

	socket.on('pointer_req', function (data) {
		var date = new Date();
		dawgs[data.id] = {
			x: data.mx,
			y: data.my,
			t: date.getTime()
		};
	});

	var emiter = setInterval(emitDawgs, 50);
	var police = setInterval(killDawgs, 2000);

	function emitDawgs() {
		socket.emit('pointer_res', dawgs);
	}
	function killDawgs() {
		var date = new Date();
		for (var key in dawgs) {
			var obj = dawgs[key];
			for (var prop in obj) {
				if(obj.hasOwnProperty(prop)) {
					if (prop == "t" && obj[prop] < date.getTime() - 20) {
						dawgs[key] = null;
					}
				}
			}
		}
	}

});