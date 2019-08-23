import assets from "~/assets/assets";

export const displayWidth: number = 600;
export const displayHeight: number = 600;
export interface SpriteWithId {
    id: string;
    sprite: Phaser.Physics.Arcade.Sprite;
}
export interface StateUpdate {
    name: string;
    x: number;
    y: number;
    frame: string;
}
export const possiblePlayerCharacters: any[] = [assets.watchkeeper];
export const possibleEnemyCharacters: any[] = [assets.waywalker];
