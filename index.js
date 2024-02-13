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
  }
}



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('newPlayer', function(){
	  console.log(socket.id);
	  let playerid = 'player'+socket.id;
	  map[playerid] = new obj(playerid, 10, 10);
	  io.emit('newPlayer', playerid);
  });
  
  socket.on('input', function(data){
	  try{
		map[data[0]].left+=data[1];
		map[data[0]].top+=data[2];
		updater[data[0]] = map[data[0]];
	  }catch{
		  
	  }
  }); 
  
  setInterval(function(){io.emit('updateMap', updater); updater = {}},60);

setInterval(function(){console.log(map); console.log('maplog')}, 2000);
	
  socket.on('disconnect', function(){
	console.log('disconnected');
	delete map['player'+socket.id] 
  });
});

server.listen(port, () => {
  console.log(port);
}); 
