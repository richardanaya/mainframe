var DamageEffect = function(scene,x,y,num,color){
    this.scene = scene;
    this.ctx = scene.ctx;
    this.time = 0;
    this.num = num;
    this.x = x;
    this.y = y;
    this.color = color;
};

DamageEffect.prototype.update = function(delta){
    this.time += delta;
    this.ctx.fillStyle = this.color;
    this.ctx.font = "13px 'Press Start 2P'";
    var sw = this.scene.size*this.scene.viewScaleX;
    var tp = this.scene.getTileToScreen(this.x,this.y);
    var d = 1;
    this.ctx.globalAlpha = (1-this.time/d)
    this.ctx.fillText(this.num,tp.x+sw/2,tp.y+sw/4-sw/2*(this.time /d));
    this.ctx.globalAlpha = 1;

    if(this.time>=2){
        this.scene.effects.splice(this.scene.effects.indexOf(this),1);
    }
}