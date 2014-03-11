var Camo = function(character){
    this.character = character;
};

Camo.prototype = Object.create(Action.prototype);

Camo.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.character)){ complete();return; }
    this.character.camoCount = 3;
    this.character.level.scene.showInfoText( this.character.name + " melt into the shadows." );
    complete();
};