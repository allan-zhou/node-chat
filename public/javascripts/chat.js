// Initialize variables
var $usernameInput = $('.usernameInput'); // Input for username
var $messages = $('.messages'); // Messages area
let $usernameLabel = $('#usernameLabel');
var $inputMessage = $('.inputMessage'); // Input message input box
var $typing = $('.typing');
var $rooms = $('#rooms');
var $title = $('#title');

var $loginPage = $('.login-page'); // The login page
var $chatPage = $('.chat-page'); // The chatroom page

var socket = io();

let username = '';
let room = { id: 'room001', name: '' };

function login() {
  username = $usernameInput.val();
  room.id = $rooms.val();
  room.name = $rooms.find("option:selected").text();

  $usernameLabel.text(username + "：");
  $loginPage.hide();
  $chatPage.show();

  socket.emit('join', { username: username, room: room });

  $title.html(room.name);
  $usernameInput.val('');
}

function sendMessage() {
  let msg = $inputMessage.val();
  $messages.append('<li>' + msg + '</li>');
  socket.emit('sendMessage', { username: username, room: room, msg: msg });
  $inputMessage.val('');
}

function typingUp() {
  socket.emit('typingUp', { username: username, room: room, });
}

socket.on('join', (data) => {
  let msg = `${data.username} ${data.time}:加入了房间 ${data.room.name}`;
  $messages.append('<li>' + msg + '</li>');
  $title.html(`${data.room.name}(${data.room.userCount})`)
});

socket.on('leave', (data) => {
  let msg = `${data.username} ${data.time}:离开了房间 ${data.room.name}`;
  $messages.append('<li>' + msg + '</li>');
  $title.html(`${data.room.name}(${data.room.userCount})`)
});

socket.on('sendMessage', (data) => {
  let msg = `${data.username} ${data.time}：${data.msg}`
  $messages.append('<li>' + msg + '</li>');
});

socket.on('typingDown', (data) => {
  $typing.html(msg);
  $typing.fadeIn();
});

socket.on('typingUp', (data) => {
  let msg = `${data.username} 正在输入...`
  $typing.html(msg);
  $typing.fadeOut(500);
});

