import MatterEntity from "./MatterEntity";

export default class Enemy extends MatterEntity{
    constructor(data) {
        let {scene, enemy} = data;
        let drops = JSON.parse(enemy.properties.find(p=>p.name=='drops').value);
        let health = enemy.properties.find(p=>p.name=='health').value
        super({scene, x:enemy.x, y:enemy.y, texture:'enemies', frame: `${enemy.name}_idle_1`, drops, health, name: enemy.name});
    }

    static preload(scene){
        scene.load.atlas(
            'enemies', 
            'src/assets/images/enemies.png', 
            'src/assets/images/enemies_atlas.json');
        scene.load.animation('enemies_anim', 'src/assets/images/enemies_anim.json');
        scene.load.audio('wolf', 'src/assets/audio/wolf.mp3');
        scene.load.audio('bear', 'src/assets/audio/bear.mp3');
        scene.load.audio('ent', 'src/assets/audio/ent.mp3');	
    }

    update(){
        console.log('enemy update')
    }
}