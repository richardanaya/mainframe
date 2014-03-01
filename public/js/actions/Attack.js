var Attack = function(attacker,defender){
    this.attacker = attacker;
    this.defender = defender;
};

Attack.prototype = Object.create(Action.prototype);

Attack.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.defender)){ return; }
    this.defender.level.removeObject(this.defender);
    complete();
};