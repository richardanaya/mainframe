var Character = function(){
    GameObject.call(this);
    this.moves = [];
    this.tags = [];
    this.thinks = true;
    this.flipped = 0;
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

Character.prototype.move = function(x,y){
    if(this.level.isPointWithin(x,y)){
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