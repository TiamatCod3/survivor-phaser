import MatterEntity from "./MatterEntity";

export default class Resources extends MatterEntity{

    static preload(scene){
        scene.load.atlas('resources', "./src/assets/images/resources.png", "./src/assets/images/resources_atlas.json");
        scene.load.audio('tree', "./src/assets/audio/tree.mp3");
        scene.load.audio('rock', "./src/assets/audio/rock.mp3");
        scene.load.audio('bush', "./src/assets/audio/bush.mp3");
        scene.load.audio('pickup', "./src/assets/audio/pickup.mp3");
    }

    constructor(data){
        let {scene, resource} = data;
        let itemType = resource.properties.find(p => p.name === 'Type').value;
        let drops = JSON.parse(resource.properties.find(p => p.name === 'drops').value);
        let depth = resource.properties.find(p => p.name === 'depth').value;
        super({scene, x:resource.x, y: resource.y, texture: 'resources', 
                frame: itemType, drops, depth, health: 5, name: itemType});
        this.name = itemType;
        this.health = 5;
        let yOrigin = resource.properties.find(p => p.name === 'yOrigin').value;
        this.y = this.y + this.height * (yOrigin - 0.5);
        const { Body, Bodies } = Phaser.Physics.Matter.Matter
        let circleCollider = Bodies.circle(resource.x, resource.y, 12, { isSensor: false, label: 'collider' });
        this.setExistingBody(circleCollider)
        this.setStatic(true)
        this.setOrigin(0.5, yOrigin)
    }    
}