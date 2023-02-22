import MatterEntity from "./MatterEntity";

export default class Resources extends Phaser.Physics.Matter.Sprite {

    static preload(scene) {
        scene.load.atlas('resources', "./src/assets/images/resources.png", "./src/assets/images/resources_atlas.json");
        scene.load.audio('tree', "./src/assets/sounds/tree.wav");
        scene.load.audio('bush', "./src/assets/sounds/bush.wav");
        scene.load.audio('rock', "./src/assets/sounds/rock.wav");
        scene.load.audio('pickup', "./src/assets/sounds/pickup.ogg");
    }

    constructor(data) {
        let { scene, resource } = data;
        console.log(scene)
        let itemType = resource.properties.find(p => p.name === 'Type').value;
        super(scene.matter.world, resource.x, resource.y, 'resources', itemType)
        let drops = JSON.parse(resource.properties.find(p => p.name == 'drops').value)
        console.log(drops)
        let depth = resource.properties.find(p => p.name === 'depth').value
        // super({ scene: scene, x: resource.x, y: resource.y, texture: 'resources', 
        //         frame: itemType, drops, depth, health: 5, name: itemType });   
        let yOrigin = resource.properties.find(p => p.name === 'yOrigin').value;
        this.name = itemType;
        this.health = 5;
        this.sound = this.scene.sound.add(this.name);

        this.y = this.y + this.height * (yOrigin - 0.5);

        const { Bodies } = Phaser.Physics.Matter.Matter
        let circleCollider = Bodies.circle(resource.x, resource.y, 12, { isSensor: false, label: 'collider' });
        this.setExistingBody(circleCollider)
        this.setStatic(true)
        this.setOrigin(0.5, yOrigin)
    }

    
}