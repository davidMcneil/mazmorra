import { Scene } from "phaser";
import { StateUpdate } from "./consts";

export function initializePlayer(scene: Scene, x: number, y: number, texture: string) {
    let player = scene.physics.add.sprite(x, y, texture);
    player.setScale(2);
    player.setCollideWorldBounds(true);
    player.setBounce(0.5);
    return player;
}
export function stateUpdatesAreEqual(first: StateUpdate, second: StateUpdate) {
    return first.x === second.x && first.y === second.y && first.frame === second.frame;
}
