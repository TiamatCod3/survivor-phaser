export default class Resources extends Phaser.Physics.Matter.Sprite{

    static preload(scene){
        scene.load.atlas('resources', "./src/assets/images/resources.png", "./src/assets/images/resources_atlas.json");
    }

    constructor(data){
        let {scene, resource} = data;
        let itemType = resource.properties.find(p => p.name === 'Type').value;
        super(scene.matter.world, resource.x, resource.y, 'resources', itemType)
        this.scene.add.existing(this);

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
}