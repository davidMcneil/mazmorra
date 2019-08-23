import "phaser";
import { Scene } from "phaser";
import { Socket } from "socket.io";

import {
    displayHeight,
    displayWidth,
    SpriteWithId,
    StateUpdate,
    possibleEnemyCharacters,
    possiblePlayerCharacters
} from "./consts";
import { initializePlayer, stateUpdatesAreEqual, initializeEnemy } from "./functions";

let socket: Socket = require("socket.io-client")("http://localhost:3000");
// let socket: Socket = require("socket.io-client")("https://mazmorra-server.herokuapp.com/");
socket.on("connect", () => {
    console.log("you connected to the server");
});

socket.on("assignId", payload => {
    playerId = payload;
    console.log("your id is " + playerId);
    socket.emit("requestLatestState");
});

socket.on("userDisconnected", payload => {
    let deletedSprite = otherPlayersSprites.find(sprite => {
        return sprite.id === payload;
    });
    if (deletedSprite) {
        deletedSprite.sprite.destroy();
    }
    otherPlayersSprites = otherPlayersSprites.filter(sprite => {
        return sprite.id !== payload;
    });
});

let player: Phaser.Physics.Arcade.Sprite;
let playerId: string;
let otherPlayersSprites: SpriteWithId[] = [];

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

let a: Phaser.Input.Keyboard.Key;
let s: Phaser.Input.Keyboard.Key;
let w: Phaser.Input.Keyboard.Key;
let d: Phaser.Input.Keyboard.Key;

function create() {
    let scene = this as Scene;

    socket.on("newState", payload => {
        let stateUpdate = payload as StateUpdate;
        let wantedSpriteWithId: SpriteWithId = otherPlayersSprites.find(sprite => {
            return stateUpdate.name == sprite.id;
        });
        if (!wantedSpriteWithId) {
            console.log("user connected with id " + stateUpdate.name);
            let newSprite: SpriteWithId = {
                id: stateUpdate.name,
                sprite: initializeEnemy(scene, stateUpdate.x, stateUpdate.y)
            };
            otherPlayersSprites.push(newSprite);
            socket.emit("stateUpdate", {
                name: playerId,
                x: player.x,
                y: player.y,
                frame: player.frame.name
            });
            scene.physics.add.collider(player, newSprite.sprite);
        } else {
            scene.physics.add.collider(player, wantedSpriteWithId.sprite);
            wantedSpriteWithId.sprite.x = stateUpdate.x;
            wantedSpriteWithId.sprite.y = stateUpdate.y;
            if (wantedSpriteWithId.sprite.frame.name != stateUpdate.frame) {
                wantedSpriteWithId.sprite.setFrame(stateUpdate.frame);
            }
        }
    });

    a = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    w = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    s = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    d = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    player = initializePlayer(scene, Math.random() * displayWidth, Math.random() * displayHeight);

    scene.anims.create({
        key: "right",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [6, 7, 6, 8]
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "left",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [3, 4, 3, 5]
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "up",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [9, 10, 9, 11]
        }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: "down",
        frames: scene.anims.generateFrameNumbers("player", {
            frames: [0, 1, 0, 2]
        }),
        frameRate: 10,
        repeat: -1
    });
}

let directionsplayer: string[] = [];

let timer = 0;

let oldStateUpdate: StateUpdate = {
    name: "",
    x: 0,
    y: 0,
    frame: ""
};

function update() {
    let scene = this as Scene;
    if (playerId) {
        if (scene.time.now - timer > 10) {
            let stateUpdate: StateUpdate = {
                name: playerId,
                x: player.x,
                y: player.y,
                frame: player.frame.name
            };
            timer = scene.time.now;
            if (!stateUpdatesAreEqual(stateUpdate, oldStateUpdate)) {
                socket.emit("stateUpdate", stateUpdate);
                oldStateUpdate = stateUpdate;
            }
        }
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
                player.anims.play("up", true);
                break;
            case "down":
                player.setVelocityY(300);
                player.anims.play("down", true);
                break;
            case "left":
                player.setVelocityX(-300);
                player.anims.play("left", true);
                break;
            case "right":
                player.setVelocityX(300);
                player.anims.play("right", true);
                break;
        }
    }
}

let game: Phaser.Game = new Phaser.Game(config);
