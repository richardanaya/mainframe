var Attack = function(attacker,defender, weapon){
    this.attacker = attacker;
    this.defender = defender;
    this.weapon = weapon;
};

Attack.prototype = Object.create(Action.prototype);

Attack.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.defender)){ complete();return; }
    if(this.weapon){
        if(this.weapon.hasTag("range")){
            new Howl({
                urls: ['sounds/sfx_8bit_general/sfx1_2.mp3'],
                volume:.2
            }).play();
        }
        else if(this.weapon.hasTag("melee")){
            new Howl({
                urls: ['sounds/sfx_8bit_general/sfx1_14.mp3'],
                volume:.2
            }).play();
        }
    }
    else {
        new Howl({
            urls: ['sounds/sfx_8bit_general/sfx2_4.mp3'],
            volume:.2
        }).play();
    }
    this.attacker.onDamage(Utilities.randRangeInt(1,5));
    this.defender.onDamage(Utilities.randRangeInt(1,10));
    window.setTimeout(complete,3000)
};