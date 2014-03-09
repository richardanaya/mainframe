var HelpScene = function(game){
    this.game = game;
    this.time = 0;
};

HelpScene.prototype = Object.create(Scene.prototype);

HelpScene.prototype.update = function(delta){
    this.time += delta;

    var bg = Resources.getImage("terminal_background");
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

    this.ctx.font = "16px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    wrapText(this.ctx,"Welcome employee! This is mean to be a simple instruction manual of how to play.",30,40,window.innerWidth-60,30)

};

HelpScene.prototype.onKeyDown = function(key){
    this.game.changeScene(new StartScene(this.game));
};

HelpScene.prototype.onTap = function(x,y){
    this.game.changeScene(new StartScene(this.game));
};