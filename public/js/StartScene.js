var StartScene = function(game){
    this.game = game;
    this.time = 0;

};

StartScene.prototype = Object.create(Scene.prototype);

StartScene.prototype.update = function(delta){
    this.time += delta;
    //this.width;
    //this.height
    //this.ctx
    //this.ctx.drawImage(Resources.images.lab_note)

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0,0,50,50);

};


StartScene.prototype.onKeyDown = function(key){
    this.game.changeScene(new TestScene(this.game));
};

StartScene.prototype.onTap = function(x,y){

};