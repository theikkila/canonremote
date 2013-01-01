var io = require('socket.io').listen(443);
var dl = require('delivery');
var fs = require('fs');

var sh = 0;
var ready = 1;

io.sockets.on('connection', function(socket){
	var delivery = dl.listen(socket);
	delivery.on('receive.success', function(file){
		//console.log(file);
		//console.log(file.name);
		var d = new Date();
		fs.writeFile("/usr/share/nginx/www/imgs/"+d.valueOf().toString()+".jpg", file.buffer, function(err){
			if(err){
				console.log("Something weird happened in saving file");
			}else{
				console.log("File saved!");
				socket.broadcast.emit('newfile', 'imgs/'+d.valueOf().toString()+".jpg");
			}
		});
	});
	socket.on('change', function(data){
		console.log("shoot!");
		socket.broadcast.emit('shoot', {shutter:1});
	});
	socket.on('ready', function(data){
		ready = data.ready;
		console.log("Ready: "+ready);
		socket.broadcast.emit('ready', ready);	
	});
	socket.on('status', function(data){
		socket.emit('ready', ready);
	});
});

