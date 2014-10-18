var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('uuid');

app.use(express.static(__dirname + '/public'));

var players = [];
var colors = ['green', 'red', 'yellow', 'blue', 'purple', 'cyan', 'orange', 'pink'];
var i = 0;

io.on('connection', function (player) {

  player.on('player_created', function (data) {
    player.x = data.x;
    player.y = data.y;
    player.rotation = 0;
    players.push(player);

    // send to other player a new p connected
    player.broadcast.emit('new_player_joined', {x: player.x, y: player.y, id: player.id});

    // send to current user all other tanks
    players.forEach(function (sock) {
      if (player != sock) {
        player.emit('load_other_tanks', {x: sock.x, y: sock.y, id: sock.id, rotation: sock.rotation});
      }
    });
  });

  // remove from array on disconnect
  player.on('disconnect', function () {

    var i = players.indexOf(player);
    if (i > -1) {
      players.splice(i, 1);
    }

    players.forEach(function (sock) {
      sock.emit('remove_tank', {id: player.id});
    });
  });

  player.on('update_current_player', function (data) {
    // save the new x and y of the player on the server
    // for new players that join.
    var i = players.indexOf(player);

    if (i > -1) {
      players[i].x = data.x;
      players[i].y = data.y;
      players[i].rotation = data.rotation;
    }

    // broadcast to all other players current player's new data
    player.broadcast.emit('update_locations', {x: data.x, y: data.y, rotation: data.rotation, id: player.id});
  });
});

server.listen(3000);
console.log('listening on port 3000');