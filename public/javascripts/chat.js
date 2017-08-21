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

  $title.text(room.name);
  $usernameInput.val('');
}

function sendMessage() {
  let msg = $inputMessage.val();
  $messages.append('<li>' + msg + '</li>');
  socket.emit('sendMessage', { username: username, room: room, msg: msg });
  $inputMessage.val('');
}

function typingDown() {
  socket.emit('typingDown', { username: username, room: room, });
}

function typingUp() {
  socket.emit('typingUp', { username: username, room: room, });
}

socket.on('join', (msg) => {
  $messages.append('<li>' + msg + '</li>');
});

socket.on('sendMessage', (msg) => {
  $messages.append('<li>' + msg + '</li>');
});

socket.on('typingDown', (msg) => {
  $typing.html(msg);
  $typing.fadeIn();
});

socket.on('typingUp', (msg) => {
  $typing.html(msg);
  $typing.fadeOut();
});