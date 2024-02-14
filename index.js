const port = (process.env.PORT || 3000);
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let map = {};
let updater = {};

class obj {
  constructor(id, left, top) {
    this.id = id;
    this.left = left;
    this.top = top;
	this.rotate = 0;
  }
}

map['data'] = new obj('data', 0, 0);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
	console.log(socket.id+' connected');  
	
  socket.on('newPlayer', function(name){
	  let playerid = 'player'+socket.id;
	  map[playerid] = new obj(name, 1500, 1500);
	  io.emit('newPlayer', [playerid, name]);
  });
  
  socket.on('get', function(o){
	 io.emit('newPlayer', [o, map[o][0]]);
  });
  
  socket.on('input', function(data){
	  try{
		map[data[0]].left+=data[1];
		map[data[0]].top+=data[2];
		map[data[0]].rotate=data[3];
		updater[data[0]] = map[data[0]];
	  }catch{
		  
	  }
  }); 

  socket.on('disconnect', function(){
	console.log(socket.id+' disconnected');
	delete map['player'+socket.id] 
  });
});
let i = 0;
setInterval(function(){console.log(map); console.log(i); i++}, 5000);
setInterval(function(){io.emit('updateMap', updater); updater = {}},40);

server.listen(port, () => {
  console.log(port);
}); 
