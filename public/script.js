var socket = io.connect('http://localhost');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

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
var renderer = PIXI.autoDetectRenderer(w, h);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// create an empty container
var tankContainer = new PIXI.DisplayObjectContainer();
tankContainer.position.x = 0;
tankContainer.position.y = 0;

stage.addChild(tankContainer);

function onAssetsLoaded()
{
  // add a bunch of aliens with textures from image paths
  // for (var i = 0; i < 100; i++)
  // {
  //   var frameName = tankFrames[i % 4];

  //   // create an alien using the frame name..
  //   var tank = PIXI.Sprite.fromFrame(frameName);
  //   tank.tint = Math.random() * 0xFFFFFF;


  //    * fun fact for the day :)
  //    * another way of doing the above would be
  //    * var texture = PIXI.Texture.fromFrame(frameName);
  //    * var alien = new PIXI.Sprite(texture);

  //   tank.position.x = Math.random() * 800 - 400;
  //   tank.position.y = Math.random() * 600 - 300;
  //   tank.anchor.x = 0.5;
  //   tank.anchor.y = 0.5;
  //   tanks.push(tank);
  //   tankContainer.addChild(tank);
  // }

  socket.on('connection', function (socket) {
    console.log('yoyoyo');
    var tank = PIXI.Sprite.fromFrame('tankGreen.png');
    tank.position.x = 300;
    tank.position.y = 300;
    tank.anchor.x = 0.5;
    tank.anchor.y = 0.5;
    tanks.push(tank);
    tankContainer.addChild(tank);
  });

  // start animating
  requestAnimFrame(animate);
}

function animate() {
    // render the stage
    renderer.render(stage);

    requestAnimFrame(animate);
}