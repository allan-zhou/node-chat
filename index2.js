const path = require('path');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('./public/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
})