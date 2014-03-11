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

    var rollDice = function(num,difficulty){
        var sux = 0;
        for(var i = 0; i < num; i++){
            var res = Math.floor(Math.random()*10)+1;
            if(res >=difficulty){
                sux++;
            }
            if(res == 1){
                sux--;
            }
        }
        return sux;
    }

    var offSux = rollDice(offense,8)
    var defSux = rollDice(defence,8)


    if(offSux < 0){
        this.attacker.level.scene.showInfoText("Critical failure for attacker");
    }
    else if(offSux < defSux ){
        this.attacker.level.scene.showInfoText("You missed");
    }
    else if(offSux >= defSux){

        var damSux = Math.max(rollDice((offSux-defSux)+damage,8),0);
        var armSux = Math.max(rollDice(armor,8),0);
        var dam = Math.max(0,damSux - armSux);
        if(dam == 0){
            this.attacker.level.scene.showInfoText("Your attack hits weak");
        }
        else if(defSux<0){
            this.attacker.level.scene.showInfoText("Critical failure for defender");
            this.defender.onDamage(dam*2);
        }
        else {
            this.defender.onDamage(dam);
            this.attacker.level.scene.showInfoText("You hit for "+dam);
        }
    }
    else {
        console.log("???s")
    }


    complete();
};