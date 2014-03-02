var Button = function(scene,x,y,background){
    this.scene = scene;
    this.time = 0;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.background = "black"
    if(background){
        this.background = background;
    }
}

Button.prototype.show = function(){
    this.visible = true;
}

Button.prototype.update = function(time){
    this.time += time;
};

Button.prototype.render = function(){
    if(this.visible){
        this.scene.ctx.fillStyle = this.background;
        this.scene.ctx.fillRect(this.x,this.y,50,50);
        if(this.image){
            this.scene.ctx.drawImage(this.image,this.x,this.y,50,50)
        }
    }
}

Button.prototype.isWithin = function(x,y){
    return (x>=this.x&&x<this.x+this.width&&y>=this.y&&y<this.y+this.height);
}




Button.prototype.hide = function(){
    this.visible = false;
}