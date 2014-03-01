var Player = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.player;
};

Player.prototype.moveLeft = function(){
    if(this.level.isPointWithin(this.x-1,this.y)){
        this.level.moveTo(this.x-1,this.y,this);
    }
}

Player.prototype.moveUp = function(){
    if(this.level.isPointWithin(this.x,this.y-1)){
        this.level.moveTo(this.x,this.y-1,this);
    }
}

Player.prototype.moveRight = function(){
    if(this.level.isPointWithin(this.x+1,this.y)){
        this.level.moveTo(this.x+1,this.y,this);
    }
}

Player.prototype.moveDown = function(){
    if(this.level.isPointWithin(this.x,this.y+1)){
        this.level.moveTo(this.x,this.y+1,this);
    }
}