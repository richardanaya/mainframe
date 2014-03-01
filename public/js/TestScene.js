var TestScene = function(){

}

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.update = function(delta){
    this.ctx.fillText(this.width+" "+this.height,50,50);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.width-50,this.height-50,50,50);
};
