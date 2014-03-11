var Dialog = function(scene,txt){
    this.scene = scene;
    this.txt = txt;
    this.visible = false;
    this.time = 0;
}

Dialog.prototype.show = function(complete){
    this.visible = true;
}


Dialog.prototype.update = function(time){
    this.time += time;
};


Dialog.prototype.render = function(){
    if(this.visible){
        var w = window.innerWidth*3/4;
        var h = window.innerHeight*3/4;
        var x = (this.scene.width-w)/2;
        var y = (this.scene.height-h)/2;

        this.scene.ctx.fillStyle = "black";
        this.scene.ctx.globalAlpha = .5;
        this.scene.ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
        this.scene.ctx.globalAlpha = 1;
        this.drawBox(x,y,w,h);

        this.scene.ctx.fillStyle = "white";

        this.scene.ctx.font = "10px 'Press Start 2P'";
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var paragraphs = text.split('\n');
            for(var i = 0; i < paragraphs.length; i++){
                text = paragraphs[i];
                var words = text.split(' ');
                var line = '';

                for(var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = context.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        context.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                }
                context.fillText(line, x, y);
                y+=lineHeight
            }
        }
        if(this.image){
            if(this.time%2<1){
                this.scene.ctx.drawImage(this.image,(window.innerWidth-50)/2,y+30,80,80);
            }
            else {
                if(this.imageAnim){
                    this.scene.ctx.drawImage(this.imageAnim,(window.innerWidth-50)/2,y+30,80,80);
                }
                else {
                    this.scene.ctx.drawImage(this.image,(window.innerWidth-50)/2,y+30,80,80);
                }
            }
            wrapText(this.scene.ctx,this.txt,x+20, y+140, w-40,30)
        }
        else {
            wrapText(this.scene.ctx,this.txt,x+20, y+40, w-40,30)
        }
    }
}

Dialog.prototype.drawBox = function(x,y,width,height){
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
    context.rect(x+4,y+4,width-8,height-8);
    context.clip();

    context.beginPath();
    for(var xx=0;xx<width/32;xx++){
        for(var yy=0;yy<height/32;yy++){
            this.scene.ctx.drawImage(dialog_bg,x+xx*32,y+yy*32,32,32);
        }
    }


    context.restore();


    this.scene.ctx.drawImage(dialog_frame_topleft,x,y,12,12);
    this.scene.ctx.drawImage(dialog_frame_top,x+12,y,width-24,12);
    this.scene.ctx.drawImage(dialog_frame_bottomleft,x,y+height-12,12,12);
    this.scene.ctx.drawImage(dialog_frame_left,x,y+12,12,height-24);
    this.scene.ctx.drawImage(dialog_frame_right,x+width-12,y+12,12,height-24);
    this.scene.ctx.drawImage(dialog_frame_topright,x+width-12,y,12,12);
    this.scene.ctx.drawImage(dialog_frame_bottomright,x+width-12,y+height-12,12,12);
    this.scene.ctx.drawImage(dialog_frame_bottom,x+12,y+height-12,width-24,12);
}


Dialog.prototype.hide = function(){
    this.visible = false;
}