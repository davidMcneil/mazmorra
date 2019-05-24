// import "phaser";
// import assets from "~/assets/assets";

// let player;
// let stars;
// let bombs;
// let platforms;
// let cursors;
// let score = 0;
// let gameOver = false;
// let scoreText;

// function preload() {
//     this.load.image("sky", assets.sky);
//     this.load.image("ground", assets.platform);
//     this.load.image("star", assets.star);
//     this.load.image("bomb", assets.bomb);
//     this.load.spritesheet("dude", assets.dude, { frameWidth: 32, frameHeight: 48 });
// }

// function create() {
//     //  A simple background for our game
//     this.add.image(400, 300, "sky");

//     //  The platforms group contains the ground and the 2 ledges we can jump on
//     platforms = this.physics.add.staticGroup();

//     //  Here we create the ground.
//     //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
//     platforms
//         .create(400, 568, "ground")
//         .setScale(2)
//         .refreshBody();

//     //  Now let's create some ledges
//     platforms.create(600, 400, "ground");
//     platforms.create(50, 250, "ground");
//     platforms.create(750, 220, "ground");

//     // The player and its settings
//     player = this.physics.add.sprite(100, 450, "dude");

//     //  Player physics properties. Give the little guy a slight bounce.
//     player.setBounce(0.2);
//     player.setCollideWorldBounds(true);

//     //  Our player animations, turning, walking left and walking right.
//     this.anims.create({
//         key: "left",
//         frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
//         frameRate: 10,
//         repeat: -1
//     });

//     this.anims.create({
//         key: "turn",
//         frames: [{ key: "dude", frame: 4 }],
//         frameRate: 20
//     });

//     this.anims.create({
//         key: "right",
//         frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
//         frameRate: 10,
//         repeat: -1
//     });

//     //  Input Events
//     cursors = this.input.keyboard.createCursorKeys();

//     //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
//     stars = this.physics.add.group({
//         key: "star",
//         repeat: 11,
//         setXY: { x: 12, y: 0, stepX: 70 }
//     });

//     stars.children.iterate(function(child) {
//         //  Give each star a slightly different bounce
//         child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
//     });

//     bombs = this.physics.add.group();

//     //  The score
//     scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" });

//     //  Collide the player and the stars with the platforms
//     this.physics.add.collider(player, platforms);
//     this.physics.add.collider(stars, platforms);
//     this.physics.add.collider(bombs, platforms);

//     //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
//     this.physics.add.overlap(player, stars, collectStar, null, this);

//     this.physics.add.collider(player, bombs, hitBomb, null, this);
// }

// function update() {
//     if (gameOver) {
//         return;
//     }

//     if (cursors.left.isDown) {
//         player.setVelocityX(-160);

//         player.anims.play("left", true);
//     } else if (cursors.right.isDown) {
//         player.setVelocityX(160);

//         player.anims.play("right", true);
//     } else {
//         player.setVelocityX(0);

//         player.anims.play("turn");
//     }

//     if (cursors.up.isDown && player.body.touching.down) {
//         player.setVelocityY(-330);
//     }
// }

// function collectStar(player, star) {
//     star.disableBody(true, true);

//     //  Add and update the score
//     score += 10;
//     scoreText.setText("Score: " + score);

//     if (stars.countActive(true) === 0) {
//         //  A new batch of stars to collect
//         stars.children.iterate(function(child) {
//             child.enableBody(true, child.x, 0, true, true);
//         });

//         var x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

//         var bomb = bombs.create(x, 16, "bomb");
//         bomb.setBounce(1);
//         bomb.setCollideWorldBounds(true);
//         bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
//         bomb.allowGravity = false;
//     }
// }

// function hitBomb(player) {
//     this.physics.pause();

//     player.setTint(0xff0000);

//     player.anims.play("turn");

//     gameOver = true;
// }

// var config: Phaser.Types.Core.GameConfig = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     physics: {
//         default: "arcade",
//         arcade: {
//             gravity: { y: 300 },
//             debug: false
//         }
//     },
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// new Phaser.Game(config);

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
      gravity: { y: 1800 },
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
  this.load.image("sword", assets.sword);
  this.load.image("background", assets.backgrounds);
  this.load.spritesheet("hero", assets.backpackGuy, {
    frameWidth: 32,
    frameHeight: 32
  });
  this.load.spritesheet("items", assets.items, {
    frameWidth: 16,
    frameHeight: 16
  });
}

function create() {

  cursors = this.input.keyboard.createCursorKeys();

  platforms = this.physics.add.staticGroup();
  platforms.create(-100, 450, "sword");
  platforms.create(250, 750, "sword");
  platforms.create(750, 450, "sword");

  player = this.physics.add.sprite(100, 20, "hero");
  player.setDisplaySize(64, 64);
  player.setCollideWorldBounds(true);
  player.setBounce(0.5);
  player.body.setGravityY(1.7);
  this.physics.add.collider(player, platforms);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("hero", {
      frames: [3, 4, 3, 5]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("hero", {
      frames: [6, 7, 6, 8]
    }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "faceFront",
    frames: [{ key: "hero", frame: 0 }],
    frameRate: 20
  });

  let items = this.physics.add.group({
    key: "items",
    repeat: 8,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  items.children.iterate(function (child) {
    child.setBounceY(.9);
    child.setDisplaySize(32, 32);
  });

  this.physics.add.collider(platforms, items);
  this.physics.add.overlap(player, items, getItem, null, this);

  var score = 0;
  var scoreText;
  function getItem(player, item) {
    item.disableBody(true, true);
    score += 1;
    scoreText.setText("score: " + score);
    if (items.countActive(true) === 0) {
      console.log("hi");
      items.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }
  scoreText = this.add.text(10, 10, "score: 0", {
    fontSize: "32px",
    fill: "#FFF"
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-225);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(225);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("faceFront", true);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-630);
  }
}

let game = new Phaser.Game(config);
