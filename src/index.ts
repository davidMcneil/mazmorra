import "phaser";
import assets from "~/assets/assets";
import { Scene } from "phaser";

let cursors;
let platforms;
let player1;
let player2;

let displayWidth = 600;
let displayHeight = 600;

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: displayWidth,
  height: displayHeight,
  render: {
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload() {
  let scene = this as Scene;
  scene.load.spritesheet("player1", assets.vanguard, {
    frameWidth: 32,
    frameHeight: 32
  });
  scene.load.spritesheet("player2", assets.watchkeeper, {
    frameWidth: 32,
    frameHeight: 32
  });
  scene.load.spritesheet("items", assets.items, {
    frameWidth: 32,
    frameHeight: 32
  });
  scene.load.image("backgroundTiles", assets.backgrounds);
}

let up;
let down;
let left;
let right;

let a;
let s;
let w;
let d;
function create() {
  let scene = this as Scene;

  var level = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 3, 0, 0, 0, 1, 2, 3, 0],
    [0, 5, 6, 7, 0, 0, 0, 5, 6, 7, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 14, 13, 14, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 14, 14, 14, 14, 14, 0, 0, 0, 15],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 15],
    [35, 36, 37, 0, 0, 0, 0, 0, 15, 15, 15],
    [39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39]
  ]

  var map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
  var tiles = map.addTilesetImage("backgroundTiles");
  var layer = map.createStaticLayer(0, tiles, 0, 0);

  up = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  down = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

  a = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  w = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  s = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  d = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

  cursors = scene.input.keyboard.createCursorKeys();

  player1 = scene.physics.add.sprite(500, 20, "player1");
  player1.setSize(20, 20);
  player1.scaleX = 2;
  player1.scaleY = player1.scaleX;
  player1.setCollideWorldBounds(true);
  player1.setBounce(0.5);

  player2 = scene.physics.add.sprite(100, 20, "player2");
  player2.setSize(20, 20);
  player2.scaleX = 2;
  player2.scaleY = player2.scaleX;
  player2.setCollideWorldBounds(true);
  player2.setBounce(0.5);

  scene.physics.add.collider(player1, player2)

  scene.anims.create({
    key: "right1",
    frames: scene.anims.generateFrameNumbers("player1", {
      frames: [3, 4, 3, 5]
    }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "left1",
    frames: scene.anims.generateFrameNumbers("player1", {
      frames: [6, 7, 6, 8]
    }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "up1",
    frames: scene.anims.generateFrameNumbers("player1", {
      frames: [9, 10, 9, 11]
    }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "down1",
    frames: scene.anims.generateFrameNumbers("player1", {
      frames: [0, 1, 0, 2]
    }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: "left2",
    frames: scene.anims.generateFrameNumbers("player2", {
      frames: [3, 4, 3, 5]
    }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "right2",
    frames: scene.anims.generateFrameNumbers("player2", {
      frames: [6, 7, 6, 8]
    }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "up2",
    frames: scene.anims.generateFrameNumbers("player2", {
      frames: [9, 10, 9, 11]
    }),
    frameRate: 10,
    repeat: -1
  });
  scene.anims.create({
    key: "down2",
    frames: scene.anims.generateFrameNumbers("player2", {
      frames: [0, 1, 0, 2]
    }),
    frameRate: 10,
    repeat: -1
  });
}

let directionsPlayer1 = [];
let directionsPlayer2 = [];

function update() {
  let scene = this as Scene;
  if (Phaser.Input.Keyboard.JustDown(up)) {
    directionsPlayer1.push("up");
  }
  if (Phaser.Input.Keyboard.JustDown(down)) {
    directionsPlayer1.push("down");
  }
  if (Phaser.Input.Keyboard.JustDown(left)) {
    directionsPlayer1.push("left");
  }
  if (Phaser.Input.Keyboard.JustDown(right)) {
    directionsPlayer1.push("right");
  }
  if (Phaser.Input.Keyboard.JustUp(up)) {
    directionsPlayer1 = directionsPlayer1.filter(d => d !== "up");
  }
  if (Phaser.Input.Keyboard.JustUp(down)) {
    directionsPlayer1 = directionsPlayer1.filter(d => d !== "down");
  }
  if (Phaser.Input.Keyboard.JustUp(left)) {
    directionsPlayer1 = directionsPlayer1.filter(d => d !== "left");
  }
  if (Phaser.Input.Keyboard.JustUp(right)) {
    directionsPlayer1 = directionsPlayer1.filter(d => d !== "right");
  }
  player1.setVelocity(0);
  if (directionsPlayer1.length === 0) {
    player1.anims.stop();
  } else {
    switch (directionsPlayer1[directionsPlayer1.length - 1]) {
      case "up":
        player1.setVelocityY(-300);
        player1.anims.play("up1", true)
        break;
      case "down":
        player1.setVelocityY(300);
        player1.anims.play("down1", true)
        break;
      case "left":
        player1.setVelocityX(-300);
        player1.anims.play("left1", true)
        break;
      case "right":
        player1.setVelocityX(300);
        player1.anims.play("right1", true)
        break;
    }
  }

  if (Phaser.Input.Keyboard.JustDown(w)) {
    directionsPlayer2.push("w");
  }
  if (Phaser.Input.Keyboard.JustDown(s)) {
    directionsPlayer2.push("s");
  }
  if (Phaser.Input.Keyboard.JustDown(a)) {
    directionsPlayer2.push("a"); s
  }
  if (Phaser.Input.Keyboard.JustDown(d)) {
    directionsPlayer2.push("d");
  }
  if (Phaser.Input.Keyboard.JustUp(w)) {
    directionsPlayer2 = directionsPlayer2.filter(d => d !== "w");
  }
  if (Phaser.Input.Keyboard.JustUp(s)) {
    directionsPlayer2 = directionsPlayer2.filter(d => d !== "s");
  }
  if (Phaser.Input.Keyboard.JustUp(a)) {
    directionsPlayer2 = directionsPlayer2.filter(d => d !== "a");
  }
  if (Phaser.Input.Keyboard.JustUp(d)) {
    directionsPlayer2 = directionsPlayer2.filter(d => d !== "d");
  }
  player2.setVelocity(0);
  if (directionsPlayer2.length === 0) {
    player2.anims.stop();
  } else {
    switch (directionsPlayer2[directionsPlayer2.length - 1]) {
      case "w":
        player2.setVelocityY(-300);
        player2.anims.play("up2", true)
        break;
      case "s":
        player2.setVelocityY(300);
        player2.anims.play("down2", true)
        break;
      case "a":
        player2.setVelocityX(-300);
        player2.anims.play("left2", true)
        break;
      case "d":
        player2.setVelocityX(300);
        player2.anims.play("right2", true)
        break;
    }
  }
}

let game = new Phaser.Game(config);
