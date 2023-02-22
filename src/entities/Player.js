export default class Player extends Phaser.Physics.Matter.Sprite{
    constructor(data){
        let {scene, x, y, texture, frame} = data;
        super(scene, x, y, texture, frame);
        this.scene.add.existing(this);

        //Weapon
        this.spriteWeapon = new Phaser.GameObjects.Sprite(
            this.scene,
            this.x,
            this.y,
            'items',
            162
        )
        this.spriteWeapon.setScale(0.8)
        this.spriteWeapon.setOrigin(0.25, 0.75)
        this.scene.add.existing(this.spriteWeapon)
        this.touching = []


        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, 12,{isSensor: false, labe: 'playerCollider'})
        let playerSensor = Bodies.circle(this.x, this.y, 24,{isSensor: true, labe: 'playerCollider'})

        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictioAir: 0.35
        })
        this.setExistingBody(compoundBody)
        this.setFixedRotation();
        this.CreateMiningCollisions(playerSensor);
        this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
    }

    static preload(scene) {
        scene.load.atlas('female','./src/assets/images/female.png','./src/assets/images/female_atlas.json');
        scene.load.animation('female_anim', './src/assets/images/female_anim.json')
        let spritesheet = scene.load.spritesheet(
            'items', 
            './src/assets/images/items.png',
            {
                frameWidth: 32, 
                frameHeight: 32
            }
        )
    }

    get velocity() {
        return this.body.velocity
    }
    

    update(){
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        
        if(this.inputKeys.left.isDown) {
            playerVelocity.x = -speed;
        }else if(this.inputKeys.right.isDown) {
            playerVelocity.x = speed;
        }

        if(this.inputKeys.up.isDown) {
            playerVelocity.y = -speed;
        }else if(this.inputKeys.down.isDown) {
            playerVelocity.y = speed;
        }
        
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        if(Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1){
            this.anims.play('female_walk', true);
        }else{
            this.anims.play('female_idle', true);
        }

        this.spriteWeapon.setPosition(this.x, this.y)
        this.weaponRotate();
    }

    weaponRotate(){
        let pointer = this.scene.input.activePointer
        if(pointer.isDown){
            this.weaponRotation += 6
        }else{
            this.weaponRotation = 0
        }
        if(this.weaponRotation>100){
            this.weaponRotation = 0
        }
        if(this.flipX){
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
        }else{
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
    }

    
    CreateMiningCollisions(playerSensor){
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other =>{
                if(other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
                console.log(this.touching.length, other.gameObjectB.name)
            },
            context: this.scene,
        })

        this.scene.matterCollision.addOnCollideEnd({
            objectA: [playerSensor],
            callback: other =>{
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB)
                console.log(this.touching.length)
            },
        })
    }
}