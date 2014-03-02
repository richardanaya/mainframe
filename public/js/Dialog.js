var Dialog = function(scene,txt){
    this.scene = scene;
    this.txt = txt;
    this.visible = false;
}

Dialog.prototype.show = function(){
    this.visible = true;
}


Dialog.prototype.update = function(time){
    this.time += time;
};


Dialog.prototype.render = function(){
    if(this.visible){
        var w = 300;
        var h = 300;
        var x = (this.scene.width-w)/2;
        var y = (this.scene.height-h)/2;

        this.scene.ctx.globalAlpha = .3;
        this.drawBox(x,y,w,h);

        this.scene.ctx.fillStyle = "white";
        this.scene.ctx.fillText(this.txt,x+10, y+30, 280);
    }
}

Dialog.prototype.drawBox = function(x,y,width,height){
    dialog_bg = Resources.getImage("dialog_bg");
    dialog_frame_bottom = Resources.getImage("dialog_frame_bottom");
    dialog_frame_bottomleft = Resources.getImage("dialog_frame_bottomleft");
    dialog_frame_bottomright = Resources.getImage("dialog_frame_bottomright");
    dialog_frame_left = Resources.getImage("dialog_frame_left");
    dialog_frame_right = Resources.getImage("dialog_frame_right");
    dialog_frame_top = Resources.getImage("dialog_frame_top");
    dialog_frame_topleft = Resources.getImage("dialog_frame_topleft");
    dialog_frame_topright = Resources.getImage("dialog_frame_topright");



    for(var xx=0;xx<width/16;xx++){
        for(var yy=0;yy<height/16;yy++){
            this.scene.ctx.drawImage(dialog_bg,x+xx*16,y+yy*16);
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

Dialog.prototype.hide = function(){
    this.visible = false;
}