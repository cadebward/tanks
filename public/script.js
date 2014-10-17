var socket = io.connect('http://localhost');

var TANK;

// create an array of assets to load
var assetsToLoader = [ "sprite.json"];

// create a new loader
loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded;

//begin load
loader.load();

// holder to store aliens
var tanks = [];
var tankFrames = ["tankGreen.png", "tankRed.png"];

var count = 0;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);

// create a renderer instance.
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var renderer = PIXI.autoDetectRenderer(w, h, null, true);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// create an empty container
var tankContainer = new PIXI.DisplayObjectContainer();
tankContainer.position.x = 0;
tankContainer.position.y = 0;

stage.addChild(tankContainer);

socket.on('current_player', function (data) {
  var tank = PIXI.Sprite.fromFrame(data.color + '.png');
  tank.position.x = Math.random() * w - 32;
  tank.position.y = Math.random() * h - 32;
  tank.anchor.x = 0.5;
  tank.anchor.y = 0.5;
  tank.id = data.id;
  tanks.push(tank);
  TANK = tank;
  tankContainer.addChild(tank);
  socket.emit('current_player_completed', {x: tank.position.x, y: tank.position.y, color: data.color, id: data.id});
});

socket.on('new_player_joined', function (data) {
  console.log(data);
  var tank = PIXI.Sprite.fromFrame(data.color + '.png');
  tank.position.x = data.x;
  tank.position.y = data.y;
  tank.anchor.x = 0.5;
  tank.anchor.y = 0.5;
  tank.id = data.id;
  tanks.push(tank);
  tankContainer.addChild(tank);
});

socket.on('remove_tank', function (data) {
  console.log(tanks);
  for (var i = 0; i < tanks.length; i++) {
    if (tanks[i].id == data.id) {
      tankContainer.removeChild(tanks[i]);
    }
  }
});

var keys = [];

// listen for key press
window.addEventListener('keydown', function (e) {
  keys[e.keyCode] = true;
});

window.addEventListener('keyup', function (e) {
  keys[e.keyCode] = false;
});




// space 32
// w 87
// s 83
// a 65
// d 68


function onAssetsLoaded() {
  requestAnimFrame(animate);
}

function animate() {
  // render the stage
  renderer.render(stage);

  var angle = ((TANK.rotation % 360) * (180/Math.PI)) % 360;

  console.log(angle)

  // tank rotate on key press
  if (keys[37] || keys[65]) TANK.rotation -= 0.08;
  if (keys[38] || keys[87]) driveForward(angle);
  if (keys[39] || keys[68]) TANK.rotation += 0.08;
  if (keys[40] || keys[83]) driveBackward(angle);

  requestAnimFrame(animate);
}

function driveForward(angle) {
  TANK.position.x += 4 * Math.cos(angle);
  TANK.position.y += 4 * Math.sin(angle);
  console.log(angle, 4 * Math.cos(angle), 4 * Math.sin(angle));
}

function driveBackward(angle) {
  TANK.position.x -= 4 * Math.cos(angle);
  TANK.position.y -= 4 * Math.sin(angle);
}