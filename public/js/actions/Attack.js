var Attack = function(attacker,defender, weapon){
    this.attacker = attacker;
    this.defender = defender;
    this.weapon = weapon;
};

Attack.prototype = Object.create(Action.prototype);

Attack.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.defender)){ complete();return; }
    this.defender.level.removeObject(this.defender);
    this.defender.level.scene.showInfoText("You killed "+this.defender.name);
    if(this.weapon){
        if(this.weapon.hasTag("range")){
            new Howl({
                urls: ['sounds/sfx1/sfx1_2.mp3'],
                volume:.2
            }).play();
        }
        else if(this.weapon.hasTag("melee")){
            new Howl({
                urls: ['sounds/sfx1/sfx1_14.mp3'],
                volume:.2
            }).play();
        }
    }
    else {
        new Howl({
            urls: ['sounds/sfx2/sfx2_4.mp3'],
            volume:.2
        }).play();
    }
    complete();
};