import MatterEntity from "./MatterEntity";

export default class Player extends MatterEntity {
    constructor(data) {
        // let { scene, x, y, texture, frame } = data;
        super({...data, health: 20, drops:[], name: 'player'});
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
        this.pointer = this.scene.input.activePointer
        
        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, labe: 'playerCollider' })
        let playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, labe: 'playerCollider' })

        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictioAir: 0.35
        })
        this.setExistingBody(compoundBody)
        this.setFixedRotation();
        this.CreateMiningCollisions(playerSensor);
        this.createPickupCollision(playerCollider);
        // this.scene.input.on('pointermove', pointer => this.setFlipX(pointer.worldX < this.x));
        this.scene.input.on('pointermove', pointer => { 
            if(!this.dead) this.setFlipX(pointer.worldX < this.x)
        });
    }

    static preload(scene) {
        scene.load.atlas('female', './src/assets/images/female.png', './src/assets/images/female_atlas.json');
        scene.load.animation('female_anim', './src/assets/images/female_anim.json')
        let spritesheet = scene.load.spritesheet(
            'items',
            './src/assets/images/items.png',
            {
                frameWidth: 32,
                frameHeight: 32
            }
        )
        scene.load.audio('player','src/assets/audio/player.mp3');
    }

    onDeath = () => {
        this.anims.stop();
        this.setTexture('items',0);
        this.setOrigin(0.5);
        this.spriteWeapon.destroy();
    }

    update() {
        if(this.dead) return;
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        if (this.inputKeys.left.isDown || (this.pointer.isDown && this.pointer.downX <= this.x)) {
            playerVelocity.x = -speed;
        } else if (this.inputKeys.right.isDown || (this.pointer.isDown && this.pointer.downX > this.x)) {
            playerVelocity.x = speed;
        }

        if (this.inputKeys.up.isDown || (this.pointer.isDown && this.pointer.downY <= this.y)) {
            playerVelocity.y = -speed;
        } else if (this.inputKeys.down.isDown ||(this.pointer.isDown && this.pointer.downY > this.y)) {
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

        this.spriteWeapon.setPosition(this.x, this.y)
        this.weaponRotate();
    }

    weaponRotate() {
        if (this.pointer.isDown) {
            console.log(this.pointer)
            this.weaponRotation += 6;
        } else {
            this.weaponRotation = 0;
        }
        if (this.weaponRotation > 100) {
            this.whackStuff();
            this.weaponRotation = 0;
        }
        if (this.flipX) {
            this.spriteWeapon.setAngle(-this.weaponRotation - 90);
        } else {
            this.spriteWeapon.setAngle(this.weaponRotation);
        }
    }


    CreateMiningCollisions(playerSensor) {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerSensor],
            callback: other => {
                if (other.bodyB.isSensor) return;
                this.touching.push(other.gameObjectB);
                console.log(this.touching.length, other.gameObjectB.name)
            },
            context: this.scene,
        })

        this.scene.matterCollision.addOnCollideEnd({
            objectA: [playerSensor],
            callback: other => {
                this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB)
                console.log(this.touching.length)
            },
        })
    }

    createPickupCollision(playerCollider){
        this.scene.matterCollision.addOnCollideStart({
            objectA: [playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
            },
            context: this.scene,
        })

        this.scene.matterCollision.addOnCollideActive({
            objectA: [playerCollider],
            callback: other => {
                if(other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
            },
        })
    }

    whackStuff(){
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
        this.touching.forEach(gameObject =>{
            gameObject.hit();
            if(gameObject.dead) gameObject.destroy();
        });
    }
}