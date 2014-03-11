var DeathScene = function(game,music){
    this.game = game;
    this.music = music;
    this.music = new Howl({
        urls: ['sounds/GameOver2.ogg','sounds/GameOver2.mp3'],
    }).play();
    this.music.fade(0,1,1000);
    this.time = 0;
    var _this = this;

    window.setTimeout(function(){_this.enable = true},1000);
    var quotes = [ '"Mess with best, die like the rest."','"Time To Die"','"If this were a virus, you\'d be dead now."','"You didn\'t live, but then again, who does"','"You have no chance to survive make your time"'];
    this.q = quotes[Math.floor(Math.random()*quotes.length)]
};

DeathScene.prototype = Object.create(Scene.prototype);

DeathScene.prototype.update = function(delta){
    this.time += delta;

    var bg = Resources.getImage("terminal_background_black");
    this.ctx.drawImage(bg,0,0,window.innerWidth,window.innerHeight);

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
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
    }

    this.ctx.drawImage(Resources.getImage("death"),(window.innerWidth-256)/2,(window.innerHeight-256)/2-150,256,256);

    this.ctx.font = "36px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = .2;
    this.ctx.fillText("YOU DIED", (this.width-this.ctx.measureText("YOU DIED").width)/2-15, this.height/2-15+50);
    this.ctx.globalAlpha = 1;
    this.ctx.fillText("YOU DIED", (this.width-this.ctx.measureText("YOU DIED").width)/2, this.height/2+50);

    this.ctx.font = "14px 'Press Start 2P'";

    this.ctx.globalAlpha = 1;
    this.ctx.fillText(this.q, (this.width-this.ctx.measureText(this.q).width)/2, this.height/2+50+50);

};

DeathScene.prototype.onKeyDown = function(key){
    if(!this.enable){return;}
    this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};

DeathScene.prototype.onTap = function(x,y){
    if(!this.enable){return;}
    this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};