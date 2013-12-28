#!/usr/bin/env node

var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000
  , doges = [];

try {

app.use(express.static(__dirname + '/static/'));

var server = http.createServer(app);
server.listen(port);

console.log('wow http on %d', port);

var wss = new WebSocketServer({server: server});

wss.on('connection', function (socket) {
	console.log("wow doge is connect");
	var doge = {
		id: Math.floor(Math.random() * 1000000),
		x: 0,
		y: 0,
		name: "",
		wow: false,
		dead: false
	};
	doges.push(doge);
	console.log(doge);

	socket.on('message', function (data) {
		var data = JSON.parse(data);

		var date = new Date();
		doge.x = data.x;
		doge.y = data.y;
		doge.name = escapeHtml(data.name);
		doge.wow = data.wow;
	});

	var emitter = setInterval(function(){
		socket.send(JSON.stringify({
			you: doge,
			doges: doges
		}));
	}, 50);

	socket.on('close', function() {
		console.log('wow doge is disconnect');
		doge.dead = true;
		clearInterval(emitter);
	});
});

setInterval(cleanupDoges, 50);
function cleanupDoges() {
	doges.forEach(function(doge, index) {
		if(doge.dead) doges.splice(index, 1);
	});
}

function escapeHtml(text) {
	if(!text) return false;
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