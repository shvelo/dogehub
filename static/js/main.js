var pid, name;

if("localStorage" in window) {
	var name = localStorage.name;
} else {
	console.warn("wow much browser no localstorage");
}

if(!name) {
	name = window.prompt("wow enter your name") || "RandomDoge";

	if("localStorage" in window) {
		localStorage.name = name;
	}
}

$(".doge-me .name").text(name);

var host = location.origin.replace(/^http/, 'ws'),
	ws = new WebSocket(host),
	doges = [],
	online_text = "wow loading";

ws.onmessage = function (raw_data) {
	var data = JSON.parse(raw_data.data);

	pid = data.you.id;

	var doges = data.doges;

	if (doges.length < 2) {
		online_text = "wow such alone.<br>much sad :(";
	} else {
		online_text = "wow <b>" + doges.length + "</b> doges online";
	}

	doges.forEach(function(doge) {
		if(doge.id == pid) return;
		var d = $(".doge-" + doge.id);

		if (!!d.length) {
			d.css({
				top: doge.y + "px",
				left: doge.x + "px"
			});

			if(doge.wow) {
				d.addClass("wow");
				setTimeout(function(){
					d.removeClass("wow");
				}, 600);
			}
		} else {
			$("#pointer-area").append("<div class='doge doge-" +
				doge.id +
				"'><span>" +
				doge.n +
				"</span><span class=wow>WOW</span></div>");
		}
	});
}


$("body").on("mousemove", function(e) {
	try {
		ws.send(JSON.stringify({
			n: name,
			mx: e.pageX,
			my: e.pageY,
			wow: false
		}));
		$(".doge-me").css({
			left: e.pageX,
			top: e.pageY
		})
	} catch (err) {
		console.warn(err);
	}
});
$("body").on("click", function(e) {
	try {
		ws.send(JSON.stringify({
			n: name,
			mx: e.pageX,
			my: e.pageY,
			wow: true
		}));
		$(".doge-me").addClass("wow");
		setTimeout(function(){
			$(".doge-me").removeClass("wow");
		}, 600);
	} catch (err) {
		console.warn(err);
	}
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);