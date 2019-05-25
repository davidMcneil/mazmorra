import "phaser";
import assets from "~/assets/assets";

let cursors;
let platforms;
let player;

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
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
  this.load.spritesheet("hero", assets.vanguard, {
    frameWidth: 32,
    frameHeight: 32
  });
}

let up;
let down;
let left;
let right;
function create() {
  up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

  cursors = this.input.keyboard.createCursorKeys();
  player = this.physics.add.sprite(100, 20, "hero");
  player.setDisplaySize(64, 64);
  player.setCollideWorldBounds(true);
  player.setBounce(0.5);
  player.body.setGravityY(1.7);


  this.anims.create({

    key: "right",
    frames: this.anims.generateFrameNumbers("hero", {
      frames: [3, 4, 3, 5]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("hero", {
      frames: [6, 7, 6, 8]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("hero", {
      frames: [9, 10, 9, 11]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("hero", {
      frames: [0, 1, 0, 2]
    }),
    frameRate: 10,
    repeat: -1
  });
}

let directions = [];

function update() {
  if (Phaser.Input.Keyboard.JustDown(up)) {
    directions.push("up");
  }
  if (Phaser.Input.Keyboard.JustDown(down)) {
    directions.push("down");
  }
  if (Phaser.Input.Keyboard.JustDown(left)) {
    directions.push("left");
  }
  if (Phaser.Input.Keyboard.JustDown(right)) {
    directions.push("right");
  }
  if (Phaser.Input.Keyboard.JustUp(up)) {
    directions = directions.filter(d => d !== "up");
  }
  if (Phaser.Input.Keyboard.JustUp(down)) {
    directions = directions.filter(d => d !== "down");
  }
  if (Phaser.Input.Keyboard.JustUp(left)) {
    directions = directions.filter(d => d !== "left");
  }
  if (Phaser.Input.Keyboard.JustUp(right)) {
    directions = directions.filter(d => d !== "right");
  }
  player.setVelocity(0);
  if (directions.length === 0) {
    player.anims.stop();
  } else {
    switch (directions[directions.length - 1]) {
      case "up":
        player.setVelocityY(-300);
        player.anims.play("up", true)
        break;
      case "down":
        player.setVelocityY(300);
        player.anims.play("down", true)
        break;
      case "left":
        player.setVelocityX(-300);
        player.anims.play("left", true)
        break;
      case "right":
        player.setVelocityX(300);
        player.anims.play("right", true)
        break;
    }
  }
}

let game = new Phaser.Game(config);
