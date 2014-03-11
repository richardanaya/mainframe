var GunFireEffect = function(scene,start,end,color,bullet){
    this.scene = scene;
    this.ctx = scene.ctx;
    this.time = 0;
    this.attacker = start;
    this.defender = end;
    this.color = color;
    this.bullet = bullet;
    var s = this.attacker.level.scene;
    this.sx = this.attacker.x*s.size* s.viewScaleX+ s.viewTranslateX+s.size* s.viewScaleX/2;
    this.sy = this.attacker.y*s.size* s.viewScaleY+ s.viewTranslateY+s.size* s.viewScaleY/2;
    this.ex = this.defender.x*s.size* s.viewScaleX+ s.viewTranslateX+s.size* s.viewScaleX/2;
    this.ey = this.defender.y*s.size* s.viewScaleY+ s.viewTranslateY+s.size* s.viewScaleY/2;
};

GunFireEffect.prototype.update = function(delta){
    this.time += delta;
    this.ctx.strokeStyle = this.color;



    if(this.time<=.5){
        if(this.bullet == "laser"){
            this.ctx.globalAlpha = .5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.sx, this.sy);
            this.ctx.lineTo(this.ex, this.ey);
            this.ctx.lineWidth = 10;
            this.ctx.stroke();
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
        if(this.bullet == "bullet"){

            var t = this.time/.5
            var bpx = (this.ex-this.sx)*t;
            var bpy = (this.ey-this.sy)*t;
            this.ctx.globalAlpha = .5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.sx+bpx, this.sy+bpy);
            //this.ctx.lineTo(ex,ey);
            this.ctx.lineTo(this.sx+bpx+(this.ex-this.sx) *.1, this.sy+bpy+(this.ey-this.sy) *.1);
            this.ctx.lineWidth = 10;
            this.ctx.stroke();
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
    }
    else{
        this.scene.effects.splice(this.scene.effects.indexOf(this),1);
    }
}