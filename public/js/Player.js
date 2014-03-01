var Player = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.player;
    this.isAutoMoving = false;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.move = function(x,y){
    if(this.level.isPointWithin(x,y)){
        var monsters = this.level.getObjectsByTypeOnTile(x,y,"monster");
        if(monsters.length > 0){
            this.moves.push(new Attack(this,monsters[0]));
        }
        else {
            this.moves.push(new Move(x,y,this));
        }
    }
}

Player.prototype.autoMove = function(){
    if(this.isAutoMoving){
        var xOffset = (this.autoMoveX-this.x);
        if(xOffset != 0){ xOffset /= Math.abs(this.autoMoveX-this.x);}
        var yOffset = (this.autoMoveY-this.y);
        if(yOffset != 0){ yOffset /= Math.abs(this.autoMoveY-this.y);}

        if(xOffset==0&&yOffset==0){
            return false;
        }
        this.move(this.x+xOffset,this.y+yOffset);

        return true;
    }
    return false;
};

Player.prototype.autoMoveTo = function(x,y){
    this.isAutoMoving = true;
    this.autoMoveX = x;
    this.autoMoveY = y;
};

