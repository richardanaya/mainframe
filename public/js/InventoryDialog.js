var InventoryDialog = function(scene){
    this.scene = scene;
    this.visible = false;
    this.buttons = [];
}

InventoryDialog.prototype.show = function(){
    this.width = window.innerWidth*3/4;
    this.height = window.innerHeight*3/4;
    this.sx = (this.scene.width-this.width)/2;
    this.sy = (this.scene.height-this.height)/2;
    this.visible = true;
    for(var i = 0 ; i < this.scene.player.inventory.length; i++){
        var w = 5;
        var x = i%5;
        var y = Math.floor(i/5);
        var b = new Button(this.scene, this.sx+10+x*110, this.sy+10+y*110, "transparent");
        b.image = this.scene.player.inventory[i].image;
        this.buttons.push(b);
    }
}


InventoryDialog.prototype.update = function(time){
    this.time += time;
};


InventoryDialog.prototype.render = function(){
    if(this.visible){
        this.scene.ctx.fillStyle = "black";
        this.scene.ctx.globalAlpha = .5;
        this.scene.ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
        this.scene.ctx.globalAlpha = 1;
        this.drawBox(this.sx,this.sy,this.width,this.height);
        for(var i = 0 ; i < this.buttons.length ; i++){
            this.buttons[i].render();
        }
    }
}

InventoryDialog.prototype.drawBox = function(x,y,width,height){
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

    var context = this.scene.ctx;

    context.save();
    // Draw the path that is going to be clipped
    context.beginPath();
    context.rect(x,y,width,height);
    context.clip();

    context.beginPath();
    for(var xx=0;xx<width/32;xx++){
        for(var yy=0;yy<height/32;yy++){
            this.scene.ctx.drawImage(dialog_bg,x+xx*32,y+yy*32,32,32);
        }
    }


    context.restore();


    this.scene.ctx.drawImage(dialog_frame_topleft,x,y,8,8);
    this.scene.ctx.drawImage(dialog_frame_top,x+8,y,width-16,8);
    this.scene.ctx.drawImage(dialog_frame_bottomleft,x,y+height-8,8,8);
    this.scene.ctx.drawImage(dialog_frame_left,x,y+8,8,height-16);
    this.scene.ctx.drawImage(dialog_frame_right,x+width-8,y+8,8,height-16);
    this.scene.ctx.drawImage(dialog_frame_topright,x+width-8,y,8,8);
    this.scene.ctx.drawImage(dialog_frame_bottomright,x+width-8,y+height-8,8,8);
    this.scene.ctx.drawImage(dialog_frame_bottom,x+8,y+height-8,width-16,8);
}

InventoryDialog.prototype.hide = function(){
    this.visible = false;
}


InventoryDialog.prototype.onTap = function(x,y){
    for(var i = 0 ; i < this.buttons.length ; i++){
        if(this.buttons[i].isWithin(x,y)){
            this.onInventoryTouch(this.scene.player.inventory[i]);
            return;
        }
    }
    this.hide();
    this.scene.mode = "play";
}

InventoryDialog.prototype.onInventoryTouch = function(i){
    alert(i.name);
}