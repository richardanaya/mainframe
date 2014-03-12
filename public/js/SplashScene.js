var SplashScene = function(game){
    this.game = game;
    this.time = 0;
    this.music = new Howl({
        urls: ['sounds/FBI.ogg','sounds/FBI.mp3']
    }).play();
};

SplashScene.prototype = Object.create(Scene.prototype);

SplashScene.prototype.update = function(delta){
    this.time += delta;
    this.ctx.fillColor = "#0e0e0f";
    this.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    if(this.time < 1){
        this.ctx.globalAlpha = this.time/1;
    }
    if(this.time > 5 ){
        this.ctx.globalAlpha = 1-(this.time-5)/1;
    }
    if(this.time >6){
        //this.music.fade(1,0,1000);
        this.game.changeScene(new StartScene(this.game,this.music));
        return;
    }
    this.ctx.drawImage(Resources.getImage("winners"),0,0,window.innerWidth,window.innerHeight);
    this.ctx.globalAlpha = 1;
};


SplashScene.prototype.onKeyDown = function(key){
    //this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};

SplashScene.prototype.onTap = function(x,y){
    //this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};