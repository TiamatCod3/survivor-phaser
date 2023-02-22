import Phaser from "phaser";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import MainScene from "./src/MainScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 512 ,
  height: 512,
  scene: [MainScene],
  backgroundColor: '#999999',
  scale:{
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0 },
      debug: true
    }
  },
  plugins: {
    scene: [
      {
        key: 'matterCollision',
        plugin: PhaserMatterCollisionPlugin,
        mapping: 'matterCollision',
        start: true,
      }
    ]
  }
}
const game = new Phaser.Game(config)
