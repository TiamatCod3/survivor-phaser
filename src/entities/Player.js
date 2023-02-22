import MatterEntity from "./MatterEntity";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

export default class Player extends MatterEntity {
    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super({ ...data, health: 2, drops: [], name: 'player' });
        this.touching = [];
        this.scene.add.existing(this);

        //Weapon
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 162);
        this.spriteWeapon.setScale(0.8);
        this.spriteWeapon.setOrigin(0.25, 0.75);
        this.scene.add.existing(this.spriteWeapon);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, labe: 'playerCollider' })
        let playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, labe: 'playerCollider' })
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictioAir: 0.35
        })
        this.setExistingBody(compoundBody)
        this.setFixedRotation();
        this.CreatingMiningCollisions(playerSensor);
        this.CreatePickupCollision(playerCollider);

        this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
        console.log(this.x, this.y)
    }

    static preload(scene) {
        scene.load.atlas('female', './src/assets/images/female.png', './src/assets/images/female_atlas.json');
        scene.load.animation('female_anim', './src/assets/images/female_anim.json')
        scene.load.spritesheet(
            'items',
            './src/assets/images/items.png',
            {
                frameWidth: 32,
                frameHeight: 32
            }
        );
        scene.load.audio('player', 'src/assets/sounds/player.wav');
    }

    update() {

        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();

        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -speed;
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = speed;
        }

        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -speed;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = speed;
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play('female_walk', true);
        } else {
            this.anims.play('female_idle', true);
        }
        this.spriteWeapon.setPosition(this.x, this.y);
        this.weaponRotate();
    }

    weaponRotate(){
        let pointer = this.scene.input.activePointer;
        if(pointer.isDown){
            this.weaponRotation += 6;
        }else{
            this.weaponRotation = 0;
        }
        console.log(this.weaponRotation)
        if(this.weaponRotation > 100){
            this.whackStuff();
            this.weaponRotation = 0;
        }

        if(this.flipX){
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
            console.log(this.spriteWeapon.angle)
        }else{
            this.spriteWeapon.setAngle(this.weaponRotation);
            console.log(this.spriteWeapon.angle)
        }
    }

    CreatingMiningCollisions(playerSensor){
        this.scene.matter.onColideStart({

        })
        // this.scene.matter.addOnCollideStart({
        //     objectA: [playerSensor],
        //     callback: other => {
        //         if(other.bodyB.isSensor) return;
        //         this.touching.push(other.GameObjectB);
        //         console.log(this.touching.length, other.gameObjectB.name);             
        //     },
        //     context: this.scene,
        // })

        // this.matterCollision.addOnCollideEnd({
        //     objectA: [playerSensor],
        //     callback: other => {
        //         this.touching.filter(gameObject => gameObject != other.gameObjectB);
        //         console.log(this.touching.length);
        //     }
        // })

    }

    CreatePickupCollision(playerCollider){
        // this.scene.matterCollision.addOnCollideStart({
        //     objectA: [playerCollider],
        //     callback: other => {
        //         if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();           
        //     },
        //     context: this.scene,
        // })

        // this.scene.matterCollision.addOnCollideActive({
        //     objectA: [playerCollider],
        //     ccallback: other => {
        //         if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();           
        //     },
        // })
    }

    whackStuff(){
        this.touching = this.touching.filter(gameObject=>gameObject.hit && !gameObject.dead);
        this.touching.filter(gameObject=>{
           gameObject.hit();
           if(gameObject.dead) gameObject.destroy();
        })
    }
}