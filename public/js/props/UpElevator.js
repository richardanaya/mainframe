var UpElevator = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.up_elevator;
    this.tags = ["elevator"];
    this.direction = "down";
}


UpElevator.prototype = Object.create(GameObject.prototype);

UpElevator.prototype.onObjectEnter = function(o){
    this.level.scene.loadLevel(this.level.scene.currentHeight+100);
}