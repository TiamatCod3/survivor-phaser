export default class Resources extends Phaser.Physics.Matter.Sprite{

    static preload(scene){
        scene.load.atlas('resources', "./src/assets/images/resources.png", "./src/assets/images/resources_atlas.json");
        scene.load.audio('tree', "./src/assets/audio/tree.mp3");
        scene.load.audio('rock', "./src/assets/audio/rock.mp3");
        scene.load.audio('bush', "./src/assets/audio/bush.mp3");
    }

    constructor(data){
        let {scene, resource} = data;
        let itemType = resource.properties.find(p => p.name === 'Type').value;
        super(scene.matter.world, resource.x, resource.y, 'resources', itemType)
        this.scene.add.existing(this);
        this.name = itemType;
        this.health = 5;
        this.sound = this.scene.sound.add(this.name);
        let yOrigin = resource.properties.find(p => p.name === 'yOrigin').value;
        this.x += this.width / 2;
        this.y -= this.height / 2;
        this.y = this.y + this.height * (yOrigin - 0.5);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter
        let circleCollider = Bodies.circle(resource.x, resource.y, 12, { isSensor: false, label: 'collider' });
        this.setExistingBody(circleCollider)
        this.setStatic(true)
        this.setOrigin(0.5, yOrigin)
    }

    get dead(){
        return this.health <= 0;
    }

    hit = () =>{
        if(this.sound) this.sound.play();
        this.health--;
        console.log(`Hiting ${this.name} Health: ${this.health}`);

    }
}