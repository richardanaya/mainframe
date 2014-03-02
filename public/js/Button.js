var Button = function(scene,x,y,background){
    this.scene = scene;
    this.time = 0;
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.background = "black";
    this.visible = true;
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
        this.drawBox(this.x,this.y,this.width,this.height);
        this.scene.ctx.globalAlpha = .4;
        this.scene.ctx.fillStyle = this.background;
        this.scene.ctx.fillRect(this.x+4,this.y+4,this.width-8,this.height-8);
        this.scene.ctx.globalAlpha = 1;
        if(this.image){
            this.scene.ctx.drawImage(this.image,this.x+4,this.y+4,this.width-8,this.height-8)
        }
    }
}

Button.prototype.isWithin = function(x,y){
    return (x>=this.x&&x<this.x+this.width&&y>=this.y&&y<this.y+this.height);
}

Button.prototype.drawBox = function(x,y,width,height){
    x = Math.floor(x);
    y = Math.floor(y);
    width = Math.floor(width);
    height = Math.floor(height);
    dialog_bg = Resources.getImage("dialog_bg");
    dialog_frame_bottom = Resources.getImage("dialog_frame_bottom");
    dialog_frame_bottomleft = Resources.getImage("dialog_frame_bottomleft");
    dialog_frame_bottomright = Resources.getImage("dialog_frame_bottomright");
    dialog_frame_left = Resources.getImage("dialog_frame_left");
    dialog_frame_right = Resources.getImage("dialog_frame_right");
    dialog_frame_top = Resources.getImage("dialog_frame_top");
    dialog_frame_topleft = Resources.getImage("dialog_frame_topleft");
    dialog_frame_topright = Resources.getImage("dialog_frame_topright");



    for(var xx=0;xx<width/32;xx++){
        for(var yy=0;yy<height/32;yy++){
            if(xx*32+32>width || yy*32+32>height){
                this.scene.ctx.drawImage(dialog_bg,x+xx*32,y+yy*32,xx*32-width,yy*32+32-height,0,0,xx*32+32-width,yy*32-height);
            }
            else {
                this.scene.ctx.drawImage(dialog_bg,x+xx*32,y+yy*32);
            }
        }
    }


    this.scene.ctx.drawImage(dialog_frame_topleft,x,y);
    this.scene.ctx.drawImage(dialog_frame_top,x+4,y,width-8,4);
    this.scene.ctx.drawImage(dialog_frame_bottomleft,x,y+height-4);
    this.scene.ctx.drawImage(dialog_frame_left,x,y+4,4,height-8);
    this.scene.ctx.drawImage(dialog_frame_right,x+width-4,y+4,4,height-8);
    this.scene.ctx.drawImage(dialog_frame_topright,x+width-4,y);
    this.scene.ctx.drawImage(dialog_frame_bottomright,x+width-4,y+height-4);
    this.scene.ctx.drawImage(dialog_frame_bottom,x+4,y+height-4,width-8,4);
}


Button.prototype.hide = function(){
    this.visible = false;
}