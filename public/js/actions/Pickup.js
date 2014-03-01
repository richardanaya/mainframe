var Pickup = function(player,obj){
    this.player = player;
    this.obj = obj;
};

Pickup.prototype = Object.create(Action.prototype);

Pickup.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.obj)){ complete();return; }
    this.obj.level.removeObject(this.obj);
    this.obj.onPickup(this.player);
    this.obj.level.scene.showInfoText("You picked up "+this.obj.name);
    complete();
};