var Dialog = function(txt){
    this.txt = txt;
    this.visible = false;
}

Dialog.prototype.show = function(){
    this.visible = true;
}

Dialog.prototype.render = function(){
    if(this.visible){
        var w = 300;
        var h = 300;
        var x = (this.scene.width-w)/2;
        var y = (this.scene.height-h)/2;

        this.scene.ctx.globalAlpha = .5;
        this.scene.ctx.fillStyle = "#2a2f4d";
        this.scene.ctx.fillRect(x,y-1,w+1,h);

        this.scene.ctx.fillStyle = "#1d2033";
        this.scene.ctx.fillRect(x-1,y+1,w+1,h);

        this.scene.ctx.fillStyle = "#202439";
        this.scene.ctx.fillRect(x,y,w,h);

        this.scene.ctx.globalAlpha = 1;

        this.scene.ctx.fillStyle = "white";
        this.scene.ctx.fillText(this.txt,x+10, y+30, 280);
    }
}

Dialog.prototype.hide = function(){
    this.visible = false;
}