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

$(".dawg-me .name").text(name);

var host = location.origin.replace(/^http/, 'ws'),
	ws = new WebSocket(host),
	dawgs = {},
	online = [0, 0],
	online_text = "";

ws.onmessage = function (data) {
	dawgs = JSON.parse(data.data);
	//console.log(dawgs);
	$.each(dawgs, function(index, dawg) {
		if (index == pid) {
			return 1;
		} else if (index == "stats") {
			online = dawg;
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
		} else if (dawg == null) {
			$(".dawg-" + index).remove();
			return 1;
		}

		var d = $(".dawg-" + index);

		if (!!d.length) {
			var op = (!!dawg.a) ? "1" : "0.5";
			$(d[0]).css({
				top: dawg.y + "px",
				left: dawg.x + "px",
				opacity: op
			});

			if(dawg.wow) {
				var wow = $(d[0]).find(".wow");
				wow.show();
				setTimeout(function(){
					wow.hide();
				}, 600);
			}
		} else {
			$("#pointer-area").append("<div class='dawg dawg-" +
				index +
				"'><span>" +
				dawg.n +
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
		$(".dawg-me").css({
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
		$(".dawg-me .wow").show();
		setTimeout(function(){
			$(".dawg-me .wow").hide();
		}, 600);
	} catch (err) {
		console.warn("wow much error");
	}
});
$(function(e) {
	$(".dawg-me").css({
		left: e.pageX,
		top: e.pageY
	})
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);