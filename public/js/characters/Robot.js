var Robot = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.robot;
    this.tags = ["solid","monster"];
    this.name = "Robot";
};

Robot.prototype = Object.create(Character.prototype);

Robot.prototype.think = function(){
    var r = Math.random();

    if(r<.25){
        this.moveLeft();
    }
    else if(r<.5){
        this.moveUp();
    }
    else if(r<.75){
        this.moveRight();
    }
    else {
        this.moveDown();
    }


    var moves = this.moves;
    this.moves = [];
    return moves;
}