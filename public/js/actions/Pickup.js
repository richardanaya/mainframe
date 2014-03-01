var Pickup = function(attacker,obj){
    this.attacker = attacker;
    this.obj = obj;
};

Pickup.prototype = Object.create(Action.prototype);

Pickup.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.obj)){ return; }
    this.obj.level.removeObject(this.obj);
    this.obj.level.scene.showInfoText("You picked up "+this.obj.name);
    complete();
};