var pid, name;

if("localStorage" in window) {
	var pid = localStorage.pid;
	var name = localStorage.name;
} else {
	console.warn("wow much browser");
}

if(!pid || !name) {
	pid = Math.floor(Math.random() * 1000000);
	name = window.prompt("Enter your name") || "user"+pid;

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
	//console.log(doges);
	$.each(doges, function(index, doge) {
		if (index == pid) {
			return 1;
		} else if (index == "stats") {
			online = doge;
			if (online[0] < 1) {
				online_text = "wow loading";
			} else if (online[0] == 1) {
				online_text = "wow such alone."
					+ "<br>much sad";
			} else {
				online_text = "wow <b>" + online[0]
					+ "</b> doges online";
			}
			return 1;
		} else if (doge == null) {
			$(".doge-" + index).remove();
			return 1;
		}

		var d = $(".doge-" + index);

		if (!!d.length) {
			var op = (!!doge.a) ? "1" : "0.5";
			$(d[0]).css({
				top: doge.y + "px",
				left: doge.x + "px",
				opacity: op
			});

			if(doge.wow) {
				var wow = $(d[0]).find(".wow");
				wow.show();
				setTimeout(function(){
					wow.hide();
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
		console.warn("wow much error");
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
		$(".doge-me .wow").show();
		setTimeout(function(){
			$(".doge-me .wow").hide();
		}, 600);
	} catch (err) {
		console.warn("wow much error");
	}
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);