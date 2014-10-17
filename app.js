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
    players.push(player);

    // send to other player a new p connected
    player.broadcast.emit('new_player_joined', {x: player.x, y: player.y, id: player.id});

    // send to current user all other tanks
    players.forEach(function (sock) {
      player.emit('load_other_tanks', {x: sock.x, y: sock.y, id: sock.id});
    });
  });

  // remove from array on disconnect
  player.on('disconnect', function () {
    players.splice(players.indexOf(player), 1);
    players.forEach(function (sock) {
      sock.emit('remove_tank', {id: player.tankID});
    });
  });

  player.on('update_current_player', function (data) {
    player.broadcast.emit('update_locations', {x: data.x, y: data.y, rotation: data.rotation, id: player.id});
  });
});

server.listen(3000);
console.log('listening on port 3000');