var DownElevator = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.elevator;
    this.tags = ["elevator"];
    this.direction = "down";
}


DownElevator.prototype = Object.create(GameObject.prototype);

DownElevator.prototype.onObjectEnter = function(o){
    this.level.scene.loadLevel(this.level.scene.currentHeight-100);
}