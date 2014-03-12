var Character = function(){
    GameObject.call(this);
    this.moves = [];
    this.tags = [];
    this.thinks = true;
    this.flipped = 0;
    this.maxHealth = 75;
    this.health = 75;
    this.effects = [];
    this.strength = 0;
    this.accuracy = 0;
    this.defence = 0;
    this.mind = 0;
    this.armor = 0;
    this.damage = 0;

    this.passiveRegen = 0;
    this.canCounter = false;
    this.canCamo = false;
    this.canSeeThroughStealth = false;
    this.camoCount = 0;
    this.poisonCount = 0;

    this.stunCount = 0;
}

Character.prototype = Object.create(GameObject.prototype);

Character.prototype.moveLeft = function(){
    this.move(this.x-1,this.y);
}

Character.prototype.moveUp = function(){
    this.move(this.x,this.y-1);
}

Character.prototype.moveRight = function(){
    this.move(this.x+1,this.y);
}

Character.prototype.moveDown = function(){
    this.move(this.x,this.y+1);
}

Character.prototype.onHeal = function(d) {
    this.level.scene.effects.push(new DamageEffect(this.level.scene,this.x,this.y,d+"", "green"));
    this.health = Math.min(this.health+d, this.maxHealth);
}

Character.prototype.onDamage = function(d){
    if(this.god){
        return;
    }
    this.level.scene.effects.push(new DamageEffect(this.level.scene,this.x,this.y,d+"", "red"));

    this.health -= d;
    if(this.health<=0){
        this.onDie();
    }
}

Character.prototype.onDie = function(){
    if( this == this.level.scene.player.aggro ) this.level.scene.player.aggro = null;
    this.level.scene.showInfoText(this.name+" died.");
    this.level.removeObject(this);
};

Character.prototype.attack = function(o,w){
    this.moves.push(new Attack(this,o,w));
}

Character.prototype.move = function(x,y){
    if(this.level.isPointWithin(x,y)){
        var t = this.level.getTileAt(x,y);
        if(t.type == Level.Types.Wall || t.type == Level.Types.Prop ){
            return;
        }
        this.moves.push(new Move(x,y,this));
        if(x<this.x){
            this.flipped = true;
        }
        else {
            this.flipped = false;
        }
    }
}

Character.prototype.think = function(){
    var moves = this.moves;
    this.moves = [];
    return moves;
}

Character.prototype.update = function(delta){
    this.time += delta;

    if(this.image_idle_0 && this.image_idle_1){
        var t = this.level.scene.time%1.5;
        if(t < .75){
            this.image = this.image_idle_0;
        }
        else {
            this.image = this.image_idle_1;
        }
    }
}

Character.prototype.getOffense = function(){
    return this.strength;
};

Character.prototype.getDefence = function(){
    return this.defence - this.getArmor();
};

Character.prototype.getDamage = function(weapon){
    if(weapon){
        return this.damage+weapon.damage;
    }
    else {
        return this.damage;
    }
};

Character.prototype.getArmor = function(){
    return this.armor;
};

Character.prototype.getCurrentTile = function(){
    if( this.x != undefined && this.y != undefined ) {
        return this.level.getTileAt(this.x, this.y);
    }    
}