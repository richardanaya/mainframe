var StartScene = function(game){
    this.game = game;
    this.time = 0;
    this.music = new Howl({
        urls: ['sounds/TitleScreen.mp3'],
        loop: true
    }).play();
};

StartScene.prototype = Object.create(Scene.prototype);

StartScene.prototype.update = function(delta){
    this.time += delta;
    this.ctx.fillColor = "#0e0e0f";
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    this.ctx.drawImage(Resources.getImage("windows_bg"),0,(window.innerHeight-49*2)/2-70,480*2,49*2);
    this.ctx.drawImage(Resources.getImage("windows_bg"),480*2,(window.innerHeight-49*2)/2-70,480*2,49*2);
    this.ctx.drawImage(Resources.getImage("windows_bg"),480*2+480*2,(window.innerHeight-49*2)/2-70,480*2,49*2);
    this.ctx.drawImage(Resources.getImage("computer"),(window.innerWidth-128*2)/2,(window.innerHeight-49*2)/2,128*2,49*2);
    this.ctx.drawImage(Resources.getImage("press_start_txt"),(window.innerWidth-122*2)/2,(window.innerHeight-9*2)/2+125,122*2,9*2);
    if( (this.time%(1/12*2))/(1/12*2)< .5){
        this.ctx.drawImage(Resources.getImage("cursor_1"),(window.innerWidth-7*2)/2+130,(window.innerHeight-9*2)/2+125,7*2,9*2);
    }
    {
        this.ctx.drawImage(Resources.getImage("cursor_2"),(window.innerWidth-7*2)/2+130,(window.innerHeight-9*2)/2+125,7*2,9*2);
    }
};


StartScene.prototype.onKeyDown = function(key){
    //this.music.fade(1,0,1000);
    this.game.changeScene(new CharacterSelectScene(this.game,this.music));
};

StartScene.prototype.onTap = function(x,y){
    //this.music.fade(1,0,1000);
    this.game.changeScene(new CharacterSelectScene(this.game,this.music));
};