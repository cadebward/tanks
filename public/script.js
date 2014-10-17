var socket = io.connect('http://localhost');

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var game = new Phaser.Game(w, h, Phaser.AUTO, 'tanks', { preload: preload, create: create, update: update }, true);
var tank;

// keep track of all players
var tanks = [];

function preload() {
    game.load.atlas('tanks', 'tanks.png', 'tanks.json');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  tank = game.add.sprite(Math.random() * w - 32, Math.random() * h - 32, 'tanks');
  tank.frameName = 'red.png';
  tank.anchor.setTo(0.5, 0.5);
  tank.animations.add('forward', [7, 6, 5, 4, 3, 2, 1, 0], 5, true, true);
  tank.animations.add('backward', [0, 1, 2, 3, 4, 5, 6, 7], 5, true, true);
  game.physics.enable(tank, Phaser.Physics.ARCADE);
  socket.emit('player_created', {x: tank.body.x, y: tank.body.y});
}

function update() {
  tank.body.velocity.x = 0;
  tank.body.velocity.y = 0;
  tank.body.angularVelocity = 0;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A))
  {
    tank.body.angularVelocity = -200;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D))
  {
    tank.body.angularVelocity = 200;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
    game.physics.arcade.velocityFromAngle(tank.angle, 300, tank.body.velocity);
    tank.animations.play('forward');
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
    game.physics.arcade.velocityFromAngle(tank.angle, -300, tank.body.velocity);
    tank.animations.play('backward');
  } else {
    tank.animations.stop();
  }

  socket.emit('update_current_player', {x: tank.position.x, y: tank.position.y, rotation: tank.rotation});
}

socket.on('new_player_joined', function (data) {
  var new_player = game.add.sprite(data.x, data.y, 'tanks');
  new_player.frameName = 'red.png';
  new_player.anchor.setTo(0.5, 0.5);
  new_player.animations.add('forward', [7, 6, 5, 4, 3, 2, 1, 0], 5, true, true);
  new_player.animations.add('backward', [0, 1, 2, 3, 4, 5, 6, 7], 5, true, true);
  game.physics.enable(new_player, Phaser.Physics.ARCADE);
  new_player.id = data.id;
  tanks.push(new_player);
  console.log(tanks);
});

socket.on('load_other_tanks', function (data) {
  var new_player = game.add.sprite(data.x, data.y, 'tanks');
  new_player.frameName = 'red.png';
  new_player.anchor.setTo(0.5, 0.5);
  new_player.animations.add('forward', [7, 6, 5, 4, 3, 2, 1, 0], 5, true, true);
  new_player.animations.add('backward', [0, 1, 2, 3, 4, 5, 6, 7], 5, true, true);
  game.physics.enable(new_player, Phaser.Physics.ARCADE);
  new_player.id = data.id;
  tanks.push(new_player);
});

socket.on('remove_tank', function (data) {
  tanks.forEach(function (item) {
    if (item.id == data.id) {
      item.destroy();
      tanks.splice(tanks.indexOf(item), 1);
    }
  });
});

// CACHE IS EVIL... sometimes

socket.on('update_locations', function (data) {
  tanks.forEach(function (item) {
    if (item.id == data.id) {
      item.position.x = data.x;
      item.position.y = data.y;
      item.rotation = data.rotation;
    }
  });
});

// var keys = [];

// // listen for key press
// window.addEventListener('keydown', function (e) {
//   keys[e.keyCode] = true;
// });

// window.addEventListener('keyup', function (e) {
//   keys[e.keyCode] = false;
// });




// // space 32
// // w 87
// // s 83
// // a 65
// // d 68


// function onAssetsLoaded() {
//   requestAnimFrame(animate);
// }

// function animate() {
//   // render the stage
//   renderer.render(stage);

//   var angle = Math.abs(((TANK.rotation) * (180/Math.PI)) % 360);

//   console.log(angle);

//   // tank rotate on key press
//   if (keys[37] || keys[65]) TANK.rotation -= 0.08;
//   if (keys[38] || keys[87]) driveForward(angle);
//   if (keys[39] || keys[68]) TANK.rotation += 0.08;
//   if (keys[40] || keys[83]) driveBackward(angle);

//   requestAnimFrame(animate);
// }

// function driveForward(angle) {
//   TANK.position.x += 4 * Math.cos(angle);
//   TANK.position.y += 4 * Math.sin(angle);
//   console.log(angle, 4 * Math.cos(angle), 4 * Math.sin(angle));
// }

// function driveBackward(angle) {
//   TANK.position.x -= 4 * Math.cos(angle);
//   TANK.position.y -= 4 * Math.sin(angle);
// }