var DeathScene = function(game,music){
    this.game = game;
    this.music = music;
    this.music = new Howl({
        urls: ['sounds/GameOver.ogg','sounds/GameOver.mp3'],
    }).play();
    this.time = 0;
    var _this = this;

    window.setTimeout(function(){_this.enable = true},3000);
    var quotes = [ '"Mess with best, die like the rest."','"Time To Die"','"If this were a virus, you\'d be dead now."'];
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

    this.ctx.font = "36px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = .2;
    this.ctx.fillText("YOU DIED", (this.width-this.ctx.measureText("YOU DIED").width)/2-15, this.height/2-15);
    this.ctx.globalAlpha = 1;
    this.ctx.fillText("YOU DIED", (this.width-this.ctx.measureText("YOU DIED").width)/2, this.height/2);

    this.ctx.font = "14px 'Press Start 2P'";

    this.ctx.globalAlpha = 1;
    this.ctx.fillText(this.q, (this.width-this.ctx.measureText(this.q).width)/2, this.height/2+50);

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