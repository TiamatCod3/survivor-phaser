import Phaser from "phaser";
import Player from "./entities/Player";
import Resources from "./entities/Resources";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainsScene")
    }

    preload() {
        Player.preload(this);
        Resources.preload(this);
        this.load.image('tiles', './src/assets/images/RPG Nature Tileset.png');
        this.load.tilemapTiledJSON('map', './src/assets/images/map.json');
                
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        this.map = map;
        const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32, 32, 0, 0);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createLayer('Tile Layer 2',tileset,0,0);
        layer1.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(layer1);

        this.map.getObjectLayer('Resources').objects.forEach(resource => {
            let resourceItem = new Resources({scene: this, resource});
        })

        this.player = new Player({ scene: this.matter.world, x: 100, y: 100, texture: 'female', frame: 'townsfolk_f_idle_1' });
        // let textPlayer = new Player({ scene: this.matter.world, x: 100, y: 100, texture: 'female', frame: 'townsfolk_f_idle_1' });
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