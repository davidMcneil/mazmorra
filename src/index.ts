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
    }
};

let possibleCharacters = [assets.vanguard];

function preload() {
    let scene = this as Scene;
    scene.load.spritesheet(
        "player1",
        possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)],
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
                sprite: scene.physics.add.sprite(payload.x, payload.y, "player1")
            });
        } else {
            let wantedSprite = otherPlayersSprites.find(sprite => {
                return payload.name == sprite.id;
            }).sprite;
            wantedSprite.x = payload.x;
            wantedSprite.y = payload.y;
            console.log(wantedSprite);
            console.log(payload.direction);
        }
    });

    a = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    w = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    s = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    d = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    enter = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    playerId = Math.random();
    player = scene.physics.add.sprite(getRandomX(), getRandomY(), "player1");
    player.setSize(20, 20);
    player.scaleX = 2;
    player.scaleY = player.scaleX;
    player.setCollideWorldBounds(true);
    player.setBounce(0.5);

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
}

let directionsPlayer1 = [];
let directionsPlayer2 = [];

var timer = 0;

function update() {
    let scene = this as Scene;
    if (scene.time.now - timer > 5) {
        timer = scene.time.now;
        socket.emit("stateUpdate", {
            name: playerId,
            x: player.x,
            y: player.y,
            direction: player.currentAnim
        });
    }

    if (Phaser.Input.Keyboard.JustDown(w)) {
        directionsPlayer1.push("up");
    }
    if (Phaser.Input.Keyboard.JustDown(s)) {
        directionsPlayer1.push("down");
    }
    if (Phaser.Input.Keyboard.JustDown(a)) {
        directionsPlayer1.push("left");
    }
    if (Phaser.Input.Keyboard.JustDown(d)) {
        directionsPlayer1.push("right");
    }
    if (Phaser.Input.Keyboard.JustUp(w)) {
        directionsPlayer1 = directionsPlayer1.filter(d => d !== "up");
    }
    if (Phaser.Input.Keyboard.JustUp(s)) {
        directionsPlayer1 = directionsPlayer1.filter(d => d !== "down");
    }
    if (Phaser.Input.Keyboard.JustUp(a)) {
        directionsPlayer1 = directionsPlayer1.filter(d => d !== "left");
    }
    if (Phaser.Input.Keyboard.JustUp(d)) {
        directionsPlayer1 = directionsPlayer1.filter(d => d !== "right");
    }
    player.setVelocity(0);
    if (directionsPlayer1.length === 0) {
        player.anims.stop();
    } else {
        switch (directionsPlayer1[directionsPlayer1.length - 1]) {
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
