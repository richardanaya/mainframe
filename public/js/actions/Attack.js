var Attack = function(attacker,defender, weapon){
    this.attacker = attacker;
    this.defender = defender;
    this.weapon = weapon;
};

Attack.prototype = Object.create(Action.prototype);

Attack.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.defender)){ complete();return; }
    var isRanged = false;
    if(this.weapon){
        if(this.weapon.hasTag("range")){
            isRanged = true;
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
        if(this.weapon.hasTag("bullet")){

            this.attacker.level.scene.effects.push(new GunFireEffect(this.attacker.level.scene,this.attacker,this.defender,"yellow","bullet"));
        }
        if(this.weapon.hasTag("laser")){

            this.attacker.level.scene.effects.push(new GunFireEffect(this.attacker.level.scene,this.attacker,this.defender,"red","laser"));
        }
        if(this.weapon.hasTag("spread")){

            this.attacker.level.scene.effects.push(new GunFireEffect(this.attacker.level.scene,this.attacker,this.defender,"yellow","spread"));
        }
        if(this.weapon.hasTag("plasma")){

            this.attacker.level.scene.effects.push(new GunFireEffect(this.attacker.level.scene,this.attacker,this.defender,"skyblue","plasma"));
        }
    }
    else {
        new Howl({
            urls: ['sounds/sfx_8bit_general/sfx2_4.mp3'],
            volume:.2
        }).play();
    }

    var damage = this.attacker.getDamage(this.weapon);
    var offense = this.attacker.getOffense();
    var defence = this.defender.getDefence();
    var armor = this.defender.getArmor();

    var rollDice = function(num){
        difficulty = 8;
        var sux = 0;
        for(var i = 0; i < num; i++){
            var res = Math.floor(Math.random()*12)+1;
            if(res >= difficulty){
                sux++;
            }
        }
        return sux;
    }

    var offSux = rollDice(offense)
    var defSux = rollDice(defence)
    var hits = offSux - defSux;

    if( offSux == offense ) {
        this.attacker.level.scene.showInfoText( this.attacker.name + ' struck masterfully dealing ' + this.attacker.damage*2 + ' damage' );
    }
    else if( defSux == defence && this.defender.canCounter ) {
        var counterDamage = rollDice(defSux/2);
        this.attacker.level.scene.showInfoText( this.defender.name + ' countered ' + this.attacker.name + ' for ' + counterDamage + ' damage' );
        this.attacker.onDamage( counterDamage );
    }
    else if( hits <= 0 ){
        this.attacker.level.scene.showInfoText( this.attacker.name + ' missed ' + this.defender.name );
    }
    else {
        var dam = rollDice(damage)+1 - rollDice(armor);
        dam = Math.max(0,dam);
        this.attacker.level.scene.showInfoText( this.attacker.name + ' hit ' + this.defender.name + ' for ' + dam );
        this.defender.onDamage( dam );
    }


    complete();
};