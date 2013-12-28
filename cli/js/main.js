var pid, name;

if("localStorage" in window) {
	var pid = localStorage.pid;
	var name = localStorage.name;
} else {
	console.warn("wow much browser no localstorage");
}

if(!pid || !name) {
	pid = Math.floor(Math.random() * 1000000);
	name = window.prompt("wow enter your name") || "doge"+pid;

	if("localStorage" in window) {
		localStorage.pid = pid;
		localStorage.name = name;
	}
}

console.log("pid:" . pid);
console.log("name:" . name);

$(".doge-me .name").text(name);

var host = location.origin.replace(/^http/, 'ws'),
	ws = new WebSocket(host),
	doges = {},
	online = [0, 0],
	online_text = "";

ws.onmessage = function (data) {
	doges = JSON.parse(data.data);

	online = doges.length;
	if (online[0] < 1) {
		online_text = "wow loading";
	} else if (online[0] == 1) {
		online_text = "wow such alone.<br>much sad :(";
	} else {
		online_text = "wow <b>" + online[0] + "</b> doges online";
	}

	$.each(doges, function(index, doge) {
		if (index == pid) {
			return 1;
		} else if (doge == null) {
			$(".doge-" + index).remove();
			return 1;
		}

		var d = $(".doge-" + index);

		if (!!d.length) {
			$(d[0]).css({
				top: doge.y + "px",
				left: doge.x + "px"
			});

			if(doge.wow) {
				$(d[0]).addClass("wow");
				setTimeout(function(){
					$(d[0]).removeClass("wow");
				}, 600);
			}
		} else {
			$("#pointer-area").append("<div class='doge doge-" +
				index +
				"'><span>" +
				doge.n +
				"</span><span class=wow>WOW</span></div>");
		}
	});
}


$("body").on("mousemove", function(e) {
	try {
		ws.send(JSON.stringify({
			id: pid,
			lb: name,
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
			id: pid,
			lb: name,
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