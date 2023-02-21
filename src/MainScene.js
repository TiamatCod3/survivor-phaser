import Phaser from "phaser";
import Player from "./entities/Player";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainsScene")
    }

    preload() {
        Player.preload(this);
    }

    create() {
        this.player = new Player({scene: this.matter.world, x: 0, y: 0,texture: 'female',frame: 'townsfolk_f_idle_1'});
        let textPlayer = new Player({scene: this.matter.world, x: 100, y: 100,texture: 'female',frame: 'townsfolk_f_idle_1'});
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }
    update() {
        this.player.update();
    }
}