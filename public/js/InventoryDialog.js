var InventoryDialog = function(scene){
    this.scene = scene;
    this.visible = false;
    this.buttons = [];
}

InventoryDialog.prototype.show = function(){
    this.sx = (this.scene.width-304)/2;
    this.sy = (this.scene.height-304)/2;
    this.visible = true;
    for(var i = 0 ; i < this.scene.player.inventory.length; i++){
        var w = 5;
        var x = i%5;
        var y = Math.floor(i/5);
        var b = new Button(this.scene, this.sx+10+x*60, this.sy+10+y*60, "transparent");
        b.image = this.scene.player.inventory[i].image;
        this.buttons.push(b);
    }
}


InventoryDialog.prototype.update = function(time){
    this.time += time;
};


InventoryDialog.prototype.render = function(){
    if(this.visible){
        this.drawBox(this.sx,this.sy,304,304);
        for(var i = 0 ; i < this.buttons.length ; i++){
            this.buttons[i].render();
        }
    }
}

InventoryDialog.prototype.drawBox = function(x,y,width,height){
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
            if(xx*16+16>width || yy*16+16>height){
                this.scene.ctx.drawImage(dialog_bg,x+xx*16,y+yy*16,xx*16-width,yy*16-height,0,0,xx*16-width,yy*16-height);
            }
            else {
                this.scene.ctx.drawImage(dialog_bg,x+xx*16,y+yy*16);
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

InventoryDialog.prototype.hide = function(){
    this.visible = false;
}


InventoryDialog.prototype.onTap = function(x,y){
    for(var i = 0 ; i < this.buttons.length ; i++){
        if(this.buttons[i].isWithin(x,y)){
            this.onInventoryTouch(this.scene.player.inventory[i]);
        }
    }
}

InventoryDialog.prototype.onInventoryTouch = function(i){
    alert(i.name);
}