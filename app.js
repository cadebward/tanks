var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var players = [];
var colors = ['green', 'red', 'yellow', 'blue', 'purple', 'cyan', 'orange', 'pink'];
var i = 0;

io.on('connection', function (player) {

  player.emit('current_player', { color: colors[i%8] });
  i++;

  player.on('current_player_completed', function (playerData) {

    // update player data
    player.x = playerData.x;
    player.y = playerData.y;
    player.color = playerData.color;

    // adds new player to array
    players.push(player);

    players.forEach(function (sock) {
      if (sock != player) {
        // when a new player joins, tell all currently connected players
        sock.emit('new_player_joined', playerData);
        // when a new player joins, tell HIM about all connected players
        player.emit('new_player_joined', {x: sock.x, y: sock.y, color: sock.color});
      }
    });
  });

  // remove from array on disconnect
  player.on('disconnect', function () {
    players.splice(players.indexOf(player), 1);
  });
});

server.listen(3000);
console.log('listening on port 3000');