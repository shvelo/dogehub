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
		dead: false,
		lvl: 0
	};
	doges.push(doge);
	console.log(doge);

	socket.on('close', function() {
		clearInterval(emitter);
		console.log('wow doge is disconnect');
		doge.dead = true;
	});

	socket.on('message', function (data) {
		var data = JSON.parse(data);

		if("id" in data) {
			doges.forEach(function(dawg) {
				if(dawg.dead && dawg.id == data.id) {
					doge.lvl = dawg.lvl;
					dawg.remove = true;
				}
			});
		}

		var date = new Date();
		doge.x = data.x;
		doge.y = data.y;
		doge.name = escapeHtml(data.name);
		doge.wow = data.wow;

		if(doge.wow && doge.lvl < 100) {
			doge.lvl++;
		}
	});

	var emitter = setInterval(function(){
		if(socket.readyState != 1) return;
		socket.send(JSON.stringify({
			you: doge,
			doges: doges
		}));
	}, 50);
});

setInterval(cleanupDoges, 50);
function cleanupDoges() {
	doges.forEach(function(doge, index) {
		if(doge.remove) doges.splice(index, 1);
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