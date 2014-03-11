var HelpScene = function(game,music){
    this.game = game;
    this.music = music;
    this.time = 0;
};

HelpScene.prototype = Object.create(Scene.prototype);

HelpScene.prototype.update = function(delta){
    this.time += delta;

    var bg = Resources.getImage("terminal_background");
    this.ctx.drawImage(bg,0,0,window.innerWidth,window.innerHeight);

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

    this.ctx.font = "16px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    var concantString = "Welcome CASCORP employee! Hacking can be initiated by standing on any valid terminal tile. These ";
    concantString += "appear as yellow-screen computers, sitting on small tables. Standing on a terminal tile ";
    concantString += "will make an interactable button appear on the right side of the screen, which looks ";
    concantString += "just like the terminal tile itself. Clicking on this button will initiate the hack.";
    concantString += "Your objective while hacking is straightforward: To find which Data Cache hides the ";
    concantString += "encryption keys to access hidden areas. Unfortunately, due to the rushed nature of game ";
    concantString += "jams, we were unable to implement these hidden areas, so there's no particular reward ";
    concantString += "associated with hacking. We apologize for this missed opportunity, but we hope that ";
    concantString += "you still enjoy both hacking as well as the game as a whole.\n";
    concantString += "To get in touch with us, or to send us feedback and encouragement, you can contact ";
    concantString += "us at teampanthermoderns@gmail.com.\n\n";
    concantString += "Thank you for playing!";
    wrapText(this.ctx, concantString,30,40,window.innerWidth-60,30)

};

HelpScene.prototype.onKeyDown = function(key){
    this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};

HelpScene.prototype.onTap = function(x,y){
    this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};