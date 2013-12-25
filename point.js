var app = require('express').createServer(),
	server = require('http').createServer(app),
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
		dawgs[data.id] = {
			x: data.mx,
			y: data.my
		};
	});

	var emiter = setInterval(emitDawgs, 50);

	function emitDawgs() {
		socket.emit('pointer_res', dawgs);
	}

});