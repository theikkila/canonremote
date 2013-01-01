var sys = require('sys');
var exec = require('child_process').exec;
var child;
var watch = require("watch");
var dl = require("delivery");
var fs = require("fs");

// Server host
var host = "";

var io = require('socket.io-client');

var socket = io.connect(host);

function puts(error, stdout, stderr){
	sys.puts(stdout);
}
var delivery;
socket.on('connect', function(){
	console.log("Socket connected!");
	delivery = dl.listen(socket);
	delivery.connect();
	
	delivery.on('delivery.connect', function(delivery){
        	fs.watchFile('latest', function(curr, prev){
			console.log("File changed -> new photo accuired");
        	        fs.readFile('latest', function(err, data){
        	                if(err) throw err;
        	                delivery.send({name: data, path: data+".jpg"}, function(err){
					console.log(err);
				});
        	        });
        	});
	});
	
	delivery.on('send.success', function(file){
        	console.log("Image sent succesfully!");
	});
});

socket.on('shoot', function(data){
	console.log("shot!")
	socket.emit("ready", {ready:0})
	var client = exec("./shot.sh", puts);
	client.on('exit', function(code){
		console.log("ready");
		socket.emit("ready", {ready:1});
	});
});

