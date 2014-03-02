var StartScene = function(game){
    this.game = game;
    this.time = 0;
    this.backgroundColor = "#9900FF";
    this.music = new Howl({
        urls: ['sounds/TitleScreen.mp3'],
        loop: true
    }).play();
};

StartScene.prototype = Object.create(Scene.prototype);

StartScene.prototype.update = function(delta){
    this.time += delta;
    //this.width;
    //this.height
    //this.ctx
    //this.ctx.drawImage(Resources.images.lab_note)

    //background
    this.ctx.fillStyle = "#6600CC";
    this.ctx.fillRect(0,0,this.width,this.height);

    //upperleft triangle
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.beginPath();
    this.ctx.moveTo(0,0);
    this.ctx.lineTo(0,this.height);
    this.ctx.lineTo(this.width,0);
    this.ctx.fill();

    for (i=0;i<60;i++)
    {
       this.ctx.lineWidth = 1 - .05*i;
       this.ctx.beginPath();
       this.ctx.moveTo(0,0);
       this.ctx.lineTo(i * (.1 * this.width) * ((this.time + 3)* .15),this.height);
       this.ctx.stroke();
    }

    for (i=0;i<60;i++)
    {
       this.ctx.lineWidth = 1;
       this.ctx.beginPath();
       this.ctx.moveTo(0,this.height + (this.height * .25));
       this.ctx.lineTo(i * (.1 * this.width) * ((this.time + 3)* .15), 0);
       this.ctx.stroke();
    }

    //middle box
    this.ctx.fillStyle = "#6699FF";
    this.ctx.fillRect(this.width/4,this.height/4,this.width/2,this.height/2);

    this.ctx.fillStyle = "black";
    this.ctx.font = "bold 32px Gothic";
    this.ctx.fillText("Mainframe <3s You", this.width/2 - (this.width * .2), this.height/2);

};


StartScene.prototype.onKeyDown = function(key){
    this.music.fade(1,0,1000);
    this.game.changeScene(new TestScene(this.game));
};

StartScene.prototype.onTap = function(x,y){
    this.music.fade(1,0,1000);
    this.game.changeScene(new TestScene(this.game));
};