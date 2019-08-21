import "phaser";
import assets from "~/assets/assets";
import { Scene, Scale } from "phaser";
import { Socket } from "dgram";

let socket = require("socket.io-client")("https://mazmorra-server.herokuapp.com");
socket.on("connect", () => {
    console.log("connected");
});

let player;
let playerId;
let otherPlayersNames = [];
let otherPlayersSprites = [];

let displayWidth = 600;
let displayHeight = 600;

function getRandomX() {
    return Math.random() * displayWidth;
}

function getRandomY() {
    return Math.random() * displayHeight;
}

var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: displayWidth,
    height: displayHeight,
    render: {
        pixelArt: true
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
    },
    backgroundColor: "#d3d3d3"
};

let possiblePlayerCharacters = [assets.watchkeeper];
let possibleEnemyCharacters = [assets.waywalker];

function preload() {
    let scene = this as Scene;
    scene.load.spritesheet(
        "player",
        possiblePlayerCharacters[Math.floor(Math.random() * possiblePlayerCharacters.length)],
        {
            frameWidth: 32,
            frameHeight: 32
        }
    );
    scene.load.spritesheet(
        "enemy",
        possibleEnemyCharacters[Math.floor(Math.random() * possiblePlayerCharacters.length)],
        {
            frameWidth: 32,
            frameHeight: 32
        }
    );
}
let a;
let s;
let w;
let d;
let enter;

function create() {
    let scene = this as Scene;

    socket.on("newState", payload => {
        if (!otherPlayersNames.includes(payload.name)) {
            console.log("newUser");
            otherPlayersNames.push(payload.name);
            otherPlayersSprites.push({
                id: payload.name,
                sprite: scene.physics.add.sprite(payload.x, payload.y, "enemy").setScale(2)
            });
        } else {
            let wantedSprite: Phaser.GameObjects.Sprite = otherPlayersSprites.find(sprite => {
                return payload.name == sprite.id;
            }).sprite;
            wantedSprite.x = payload.x;
            wantedSprite.y = payload.y;
            switch (payload.direction) {
                case "right":
                    if (wantedSprite.frame.name != "6") {
                        wantedSprite.setFrame("6");
                    }
                    break;
                case "left":
                    if (wantedSprite.frame.name != "3") {
                        wantedSprite.setFrame("3");
                    }
                    break;
                case "up":
                    if (wantedSprite.frame.name != "9") {
                        wantedSprite.setFrame("9");
                    }
                    break;
                case "down":
                    if (wantedSprite.frame.name != "0") {
                        wantedSprite.setFrame("0");
                    }
                    break;
            }
            console.log(payload.direction);
        }
    });

    a = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    w = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    s = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    d = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    enter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    playerId = Math.random();
    player = scene.physics.add.sprite(getRandomX(), getRandomY(), "player");
    player.setSize(20, 20);
    player.scaleX = 2;
    player.scaleY = player.scaleX;
    player.setCollideWorldBounds(true);
    player.setBounce(0.5);

    scene.anims.create({
        key: "right1",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [6, 7, 6, 8]
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "left1",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [3, 4, 3, 5]
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "up1",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [9, 10, 9, 11]
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "down1",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [0, 1, 0, 2]
        }),
        frameRate: 10,
        repeat: -1
    });
}

let directionsplayer = [];
let directionsPlayer2 = [];

var timer = 0;

function update() {
    let scene = this as Scene;
    if (scene.time.now - timer > 10) {
        timer = scene.time.now;
        socket.emit("stateUpdate", {
            name: playerId,
            x: player.x,
            y: player.y,
            direction: directionsplayer[directionsplayer.length - 1]
        });
    }

    if (Phaser.Input.Keyboard.JustDown(w)) {
        directionsplayer.push("up");
    }
    if (Phaser.Input.Keyboard.JustDown(s)) {
        directionsplayer.push("down");
    }
    if (Phaser.Input.Keyboard.JustDown(a)) {
        directionsplayer.push("left");
    }
    if (Phaser.Input.Keyboard.JustDown(d)) {
        directionsplayer.push("right");
    }
    if (Phaser.Input.Keyboard.JustUp(w)) {
        directionsplayer = directionsplayer.filter(d => d !== "up");
    }
    if (Phaser.Input.Keyboard.JustUp(s)) {
        directionsplayer = directionsplayer.filter(d => d !== "down");
    }
    if (Phaser.Input.Keyboard.JustUp(a)) {
        directionsplayer = directionsplayer.filter(d => d !== "left");
    }
    if (Phaser.Input.Keyboard.JustUp(d)) {
        directionsplayer = directionsplayer.filter(d => d !== "right");
    }
    player.setVelocity(0);
    if (directionsplayer.length === 0) {
        player.anims.stop();
    } else {
        switch (directionsplayer[directionsplayer.length - 1]) {
            case "up":
                player.setVelocityY(-300);
                player.anims.play("up1", true);
                break;
            case "down":
                player.setVelocityY(300);
                player.anims.play("down1", true);
                break;
            case "left":
                player.setVelocityX(-300);
                player.anims.play("left1", true);
                break;
            case "right":
                player.setVelocityX(300);
                player.anims.play("right1", true);
                break;
        }
    }
}

let game = new Phaser.Game(config);
