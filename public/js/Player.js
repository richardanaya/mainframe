var Player = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.player;
};

Player.prototype = Object.create(Character.prototype);