!function(){cookies.nulltoremove=!0;var o=$(".stripes"),e=$(".stripes > div").first(),n=$(".load"),a=$(".load-audio"),i=$(".flash"),t=$("input[name='production']").val(cookies("production")?cookies("production"):""),c=$("input[name='director']").val(cookies("director")?cookies("director"):""),m=$("input[name='camera']").val(cookies("camera")?cookies("camera"):"A"),r=$("input[name='scene']").val(cookies("scene")?cookies("scene"):"1"),s=$("input[name='take']").val(cookies("take")?cookies("take"):"1"),l=$("input[name='time']"),u=$("input[name='date']"),d=$("input[name='room']").val(cookies("room")?cookies("room"):""),p=$("input.syncable"),v=$("input.cookieable"),w=io();u.val(moment().format("YYYY-MM-DD"));var k=function(){l.val(moment().format("HH:mm:ss.SS")),requestAnimationFrame(k)};requestAnimationFrame(k);var f=function(){cookies("room")&&cookies("room")!=d.val()&&(w.emit("leave-room",cookies("room")),console.log("left room",cookies("room"))),cookies({room:d.val()}),d.val().length&&(w.emit("join-room",d.val()),console.log("joined room",d.val()))};d.on("keyup",f),f();var A=function(){var o=$(this).attr("name"),e=$(this).val();console.log("sync",o,e),w.emit("sync",{name:o,val:e,room:cookies("room"),id:w.id})};p.on("keyup",A);var h=function(){var o=$(this).attr("name"),e=$(this).val(),n={};n[o]=e,console.log("save cookie",n),cookies(n)};v.on("keyup",h),w.on("sync-down",function(o){o.id!=w.id&&(console.log(o,$("input.syncable[name='"+o.name+"']"),o.val),$("input.syncable[name='"+o.name+"']").val(o.val))});var y=new Howl({src:["assets/audio/clap.webm","assets/audio/clap.mp3"]});y.once("play",function(){console.log("clapper sound play"),y.pause(),n.hide(),o.show()}),a.on("click",function(){$(this).hide(),y.play()}),o.on("click",function(){var o=Date.now();console.log(o),w.emit("clap",{time:o+500,room:cookies("room"),id:w.id})}),w.on("clap-down",function(o){var n=Date.now(),a=o.time,t=a-n;console.log("wait",t),setTimeout(function(){y.seek(0).play(),TweenMax.fromTo(e,1,{rotation:-45},{rotation:0,ease:Linear.easeNone,onComplete:function(){TweenMax.fromTo(i,1,{autoAlpha:1},{autoAlpha:0,ease:Linear.easeNone})}})},t)})}(),function(){for(var o=0,e=["webkit","moz"],n=0;n<e.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[e[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[n]+"CancelAnimationFrame"]||window[e[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e,n){var a=(new Date).getTime(),i=Math.max(0,16-(a-o)),t=window.setTimeout(function(){e(a+i)},i);return o=a+i,t}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(o){clearTimeout(o)})}();