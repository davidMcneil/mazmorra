import { Scene } from "phaser";
import { StateUpdate } from "./consts";

export function initializePlayer(scene: Scene, x: number, y: number) {
    let player = scene.physics.add.sprite(x, y, "player");
    player.setSize(20, 20);
    player.setScale(2);
    player.setCollideWorldBounds(true);
    return player;
}
export function initializeEnemy(scene: Scene, x: number, y: number) {
    let enemy = scene.physics.add.sprite(x, y, "enemy");
    enemy.setSize(20, 20);
    enemy.setScale(2);
    enemy.setCollideWorldBounds(true);
    enemy.setImmovable();
    return enemy;
}
export function stateUpdatesAreEqual(first: StateUpdate, second: StateUpdate) {
    return first.x === second.x && first.y === second.y && first.frame === second.frame;
}
