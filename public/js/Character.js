var Character = function(){
    this.moves = [];
}

Character.prototype.moveLeft = function(){
    if(this.level.isPointWithin(this.x-1,this.y)){
        this.moves.push(new Move(this.x-1,this.y,this));
    }
}

Character.prototype.moveUp = function(){
    if(this.level.isPointWithin(this.x,this.y-1)){
        this.moves.push(new Move(this.x,this.y-1,this));
    }
}

Character.prototype.moveRight = function(){
    if(this.level.isPointWithin(this.x+1,this.y)){
        this.moves.push(new Move(this.x+1,this.y,this));
    }
}

Character.prototype.moveDown = function(){
    if(this.level.isPointWithin(this.x,this.y+1)){
        this.moves.push(new Move(this.x,this.y+1,this));
    }
}

Character.prototype.think = function(){
    var moves = this.moves;
    this.moves = [];
    return moves;
}