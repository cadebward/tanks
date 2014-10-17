var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var players = [];
var colors = ['red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'orange', 'pink'];
var i = 0;

io.on('connection', function (socket) {

  var player = {
    color: colors[i%8]
  };

  socket.emit('new_player', { player: player });

  i++;
});

server.listen(3000);
console.log('listening on port 3000');