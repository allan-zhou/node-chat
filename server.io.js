function socketio(server) {
  var io = require('socket.io').listen(server);
  io.on('connection', connection);
}

let rooms = [];
let roomUserCount = {};

function connection(socket) {
  socket.on('join', function (data) {
    roomUserCount[data.room.id] = roomUserCount[data.room.id] || 0;
    roomUserCount[data.room.id] += 1;

    data.room.userCount = roomUserCount[data.room.id];
    socket.username = data.username;
    socket.room = data.room;

    // if (!rooms.find(e => { return e.id == data.room.id })) {
    //   rooms.push(data.room);
    // }
    rooms[data.room.id] = data.room
    console.log(rooms);

    socket.join(data.room.id);
    socket.broadcast.to(data.room.id).emit('join', {
      username: data.username,
      time: new Date().toLocaleTimeString(),
      room: data.room
    });
  });

  socket.on('sendMessage', function (data) {
    // socket.join(data.room.id);
    socket.to(data.room.id).emit('sendMessage', {
      username: data.username,
      time: new Date().toLocaleTimeString(),
      room: data.room,
      msg: data.msg
    });
  });

  socket.on('typingUp', function (data) {
    // socket.join(data.room.id);
    socket.broadcast.to(data.room.id).emit('typingUp', {
      username: data.username
    });
  });

  socket.on('disconnecting', (reason) => {
    console.log('disconnecting');

    if (!socket.username) return;

    if (socket.username) {
      roomUserCount[socket.room.id] -= 1;

      socket.room.userCount = roomUserCount[socket.room.id];
    }

    console.log(rooms);

    socket.leave(socket.room.id);
    socket.broadcast.to(socket.room.id).emit('leave', {
      username: socket.username,
      time: new Date().toLocaleTimeString(),
      room: socket.room
    });
  });
}

module.exports = socketio;