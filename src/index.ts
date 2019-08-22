import "phaser";
import assets from "~/assets/assets";
import { Scene } from "phaser";
import { Socket, Client } from "socket.io";

let address;
// function httpGetAsync(theUrl, callback) {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText);
//     };
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous
//     xmlHttp.send(null);
// }
// httpGetAsync("http://ip.jsontest.com/", x => {
//     console.log(x);
// });
// (function() {
//     var xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;
//     xhr.open("GET", "http://ip.jsontest.com/", true);
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             address = JSON.parse(xhr.responseText);
//         }
//     };
//     xhr.onerror = e => {
//         console.log("error: " + e);
//     };
//     xhr.send();
// })();

// let socket: Socket = require("socket.io-client")("http://localhost:3000");
let socket: Socket = require("socket.io-client")("https://mazmorra-server.herokuapp.com/");
socket.on("connect", () => {
    console.log("you connected to the server");
    if (address) {
        socket.emit("gotIp", address.ip);
    }
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

interface SpriteWithId {
    id: string;
    sprite: Phaser.Physics.Arcade.Sprite;
}

let player: Phaser.Physics.Arcade.Sprite;
let playerId: string;
let otherPlayersSprites: SpriteWithId[] = [];

let displayWidth: number = 600;
let displayHeight: number = 600;

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

let possiblePlayerCharacters: any[] = [assets.watchkeeper];
let possibleEnemyCharacters: any[] = [assets.waywalker];

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
                sprite: scene.physics.add.sprite(stateUpdate.x, stateUpdate.y, "enemy").setScale(2)
            };
            otherPlayersSprites.push(newSprite);
            socket.emit("stateUpdate", {
                name: playerId,
                x: player.x,
                y: player.y,
                frame: player.frame.name
            });
        } else {
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

let directionsplayer: string[] = [];

var timer = 0;

interface StateUpdate {
    name: string;
    x: number;
    y: number;
    frame: string;
}

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

let game: Phaser.Game = new Phaser.Game(config);

function stateUpdatesAreEqual(first: StateUpdate, second: StateUpdate) {
    return first.x === second.x && first.y === second.y && first.frame === second.frame;
}
