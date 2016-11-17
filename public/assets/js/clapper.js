(function () {

	cookies.nulltoremove = true;

	var $stripes = $(".stripes"),
		$topStripe = $(".stripes > div").first(),
		$load = $(".load"),
		$loadAudio = $(".load-audio"),
		$flash = $(".flash"),		
		$production = $("input[name='production']").val( cookies("production")?cookies("production"):"" ),
		$director = $("input[name='director']").val( cookies("director")?cookies("director"):"" ),
		$camera = $("input[name='camera']").val( cookies("camera")?cookies("camera"):"A" ),
		$scene = $("input[name='scene']").val( cookies("scene")?cookies("scene"):"1" ),
		$take = $("input[name='take']").val( cookies("take")?cookies("take"):"1" ),
		$time = $("input[name='time']"),
		$date = $("input[name='date']"),
		$room = $("input[name='room']").val( cookies("room")?cookies("room"):"" ),
		$syncable = $("input.syncable"),
		$cookieable = $("input.cookieable"),
		socket = io();
		




	// date/time
	$date.val( moment().format("YYYY-MM-DD") );
	var updateTime = function() {
		$time.val( moment().format("HH:mm:ss.SS") );
		requestAnimationFrame(updateTime);
	}
	requestAnimationFrame(updateTime);
	




	var doRoomChange = function(){
		if (cookies("room") && cookies("room") != $room.val()) { // new entry doesn't match
			socket.emit("leave-room", cookies("room"));
			console.log("left room", cookies("room"));
		}
		cookies({ room: $room.val() });
		if ($room.val().length) {			
			socket.emit("join-room", $room.val());
			console.log("joined room", $room.val());
		}
	}
	$room.on("keyup", doRoomChange);
	doRoomChange()






	var doSync = function(){
		var name = $(this).attr("name");
		var val = $(this).val();
		
		console.log("sync", name, val);

		socket.emit("sync", {name: name, val: val, room: cookies("room"), id: socket.id});

	}
	$syncable.on("keyup", doSync);





	var doCookie = function(){
		var name = $(this).attr("name");
		var val = $(this).val();

		var cookie = {};
		cookie[name] = val;
		console.log("save cookie", cookie);
		cookies(cookie);

	}
	$cookieable.on("keyup", doCookie);






	socket.on("sync-down", function(data) {
		if (data.id == socket.id) return; // kill self-updating
		console.log(data, $("input.syncable[name='"+data.name+"']"), data.val);
		$("input.syncable[name='"+data.name+"']").val(data.val);
	})







	// audio and animation logic
	var clapSound = new Howl({
		src: ['assets/audio/clap.webm', 'assets/audio/clap.mp3']
	})
	clapSound.once("play", function() {
		console.log("clapper sound play")
		clapSound.pause();
		$load.hide();
		$stripes.show();
	})
	$loadAudio.on("click", function() {
		$(this).hide();
		clapSound.play();
	})	
	
	$stripes.on("click", function() {

		var now = Date.now();
		console.log(now);
		socket.emit("clap", {time: now + 500, room: cookies("room"), id: socket.id});

	})


	socket.on("clap-down", function(data) {
		// if (data.id == socket.id) return; // kill self-updating
		
		var now = Date.now();
		var clapTime = data.time;
		var dif = clapTime - now;
		console.log("wait", dif);

		setTimeout(function() {
			clapSound.seek(0).play();
			TweenMax.fromTo($topStripe, 1, {rotation: -45}, {rotation: 0, ease: Linear.easeNone, onComplete: function(){
				TweenMax.fromTo($flash, 1, {autoAlpha: 1}, {autoAlpha: 0, ease: Linear.easeNone});
			}})
		}, dif)
		
	})


})();







(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


