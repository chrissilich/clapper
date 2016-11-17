var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

// app.get('/', function(req, res){
// 	res.send('<h1>Hello world</h1>');
// });

http.listen(3000, function(){
	console.log('listening on *:3000');
});


io.on('connection', function(socket){
	console.log('a user connected');

	socket.on("join-room", function(room) {
		console.log("a user joined", room);
		socket.join(room);
	})
	socket.on("leave-room", function(room) {
		console.log("a user left", room);
		socket.leave(room);
	})

	socket.on("sync", function(data) {
		console.log("sync", data);
		io.to(data.room).emit("sync-down", data);
	})

	socket.on("clap", function(data) {
		console.log("clap", data);
		io.to(data.room).emit("clap-down", data);
	})

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});	
});