var Attack = function(attacker,defender){
    this.attacker = attacker;
    this.defender = defender;
};

Attack.prototype = Object.create(Action.prototype);

Attack.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.defender)){ complete();return; }
    this.defender.level.removeObject(this.defender);
    this.defender.level.scene.showInfoText("You killed "+this.defender.name);
    complete();
};