var Robot = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.robot;
    this.image_idle_0 = Resources.images.robot_idle_0;
    this.image_idle_1 = Resources.images.robot_idle_1;
    this.tags = ["solid","monster"];
    this.name = "Robot";
    this.strength = 10;
    this.accuracy = 0;
    this.mind = 0;
    this.defence = 6;
    this.armor = 1;
    this.damage = 1;
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