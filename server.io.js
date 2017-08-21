function socketio(server) {
  var io = require('socket.io').listen(server);
  io.on('connection', connection);
}

let currentRoom = {};
let roomUserCount = 0;

function connection(socket) {
  socket.on('join', function (data) {
    socket.join(data.room.id);

    socket.broadcast.to(data.room.id).emit('join', `${data.username} ${new Date().toLocaleTimeString()}：加入了房间 ${data.room.name}`);
  });

  socket.on('sendMessage', function (data) {
    socket.join(data.room.id);
    socket.to(data.room.id).emit('sendMessage', `${data.username} ${new Date().toLocaleTimeString()}：${data.msg}`);
  });

  socket.on('typingDown', function (data) {
    socket.join(data.room.id);
    socket.broadcast.to(data.room.id).emit('typingDown', `${data.username}正在输入...`);
  });

  socket.on('typingUp', function (data) {
    socket.join(data.room.id);
    socket.broadcast.to(data.room.id).emit('typingUp', `${data.username}正在输入...`);
  });
}

module.exports = socketio;