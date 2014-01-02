var pid, name, lvl, message, open = false;

if("localStorage" in window && "name" in localStorage) {
	var name = localStorage.name;
} else {
	name = window.prompt("wow enter your name") || "RandomDoge";

	if("localStorage" in window) {
		localStorage.name = name;
	}
}

$("#me .name").text(name);
$("#char .name").text(name);

$("#char .name").click(function(e) {
	e.preventDefault();
	name = prompt("wow enter new name") || name;
	$("#me .name").text(name);
	$("#char .name").text(name);
	if("localStorage" in window) {
		localStorage.name = name;
	}
})

var host = "ws://doge.pirrate.me:8000",
	ws = new WebSocket(host),
	doges = [],
	online_text = "wow loading";

ws.onopen = function() {
	ws.send(JSON.stringify({
		name: name,
		wow: false
	}));

	open = true;
};

ws.onclose = function() {
	open = false;
	location.reload();
}

ws.onmessage = function (raw_data) {
	var data = JSON.parse(raw_data.data);

	pid = data.you.id;
	message = data.you.msg;
	$("#me .message").text(message);

	lvl = data.you.lvl;
	$("#char .lvl").val(lvl / 100);
	if(lvl == 100) $("#me").addClass("super");

	doges = data.doges;
	var online_doges = 1;

	$(".doge").addClass("dead");

	doges.forEach(function(doge) {
		if(doge.id == pid || doge.dead) return;
		var doge_el = $("#"+doge.id);

		online_doges++;

		if (!!doge_el.length) {
			doge_el.removeClass("dead");
			doge_el.css({
				top: doge.y,
				left: doge.x
			});
			doge_el.find(".name").text(doge.name);

			if(doge.wow) {
				doge_el.addClass("wow");
				doge_el.toggleClass("flip");
				setTimeout(function(){
					doge_el.removeClass("wow");
				}, 600);
			}
			
			doge_el.find(".message").text(doge.msg);
			
			doge_el.find("progress").val(doge.lvl / 100);
			if(doge.lvl == 100) doge_el.addClass("super");
		} else {
			$("#pointer-area").append("<div style='top:"+doge.y+"px;left:"+doge.x+"px' class='doge' id='" +
			doge.id + "'><span class=name>" + doge.name +
			"</span><span class=wow>WOW</span><span class=message></span>"+
			"<progress/></div>");
		}
	});

	if (online_doges < 2) {
		online_text = "wow such alone.<br>much sad :(";
	} else {
		online_text = "wow <b>" + online_doges + "</b> doges online";
	}

	$("#me").removeClass("dead");
	$(".doge.dead").remove();
}


$("body").on("mousemove", function(e) {
	if(!open) return;
	try {
		ws.send(JSON.stringify({
			name: name,
			x: e.pageX,
			y: e.pageY,
			wow: false
		}));
		$("#me").css({
			left: e.pageX,
			top: e.pageY
		})
	} catch (err) {
		console.warn(err);
	}
});
$("body").on("click", function(e) {
	if(!open) return;
	try {
		ws.send(JSON.stringify({
			name: name,
			x: e.pageX,
			y: e.pageY,
			wow: true
		}));
		$("#me").addClass("wow");
		$("#me").toggleClass("flip");
		$("#message input").focus();
		setTimeout(function(){
			$("#me").removeClass("wow");
		}, 600);
	} catch (err) {
		console.warn(err);
	}
});
$(window).on("keyup", function(e) {
	if(e.keyCode == 13) {
		var input = $("#message input");
		message = input.val();
		input.val("");
		input.focus();

		if(message.length > 0 && open) {
			ws.send(JSON.stringify({
				msg: message
			}));
		}
	}
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);