var socket = io.connect('http://localhost');

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

socket.on('new_player', function (data) {
  console.log(data);
  var tank = PIXI.Sprite.fromFrame(data.player.color + '.png');
  tank.position.x = 300;
  tank.position.y = 300;
  tank.anchor.x = 0.5;
  tank.anchor.y = 0.5;
  tanks.push(tank);
  tankContainer.addChild(tank);
});

function onAssetsLoaded() {
  requestAnimFrame(animate);
}

function animate() {
  // render the stage
  renderer.render(stage);
  requestAnimFrame(animate);
}