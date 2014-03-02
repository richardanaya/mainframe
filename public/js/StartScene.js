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
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.width,this.height);


    this.ctx.strokeStyle = "#15dbc4";
    for (i=0;i<20;i++)
    {
       this.ctx.lineWidth = 1;
       this.ctx.beginPath();
       this.ctx.moveTo(this.width + (1.8 * this.width) - (300 * i), this.height);
       this.ctx.lineTo((0.4 * this.width) - (300 * i), 0);
       this.ctx.stroke();
    }

    
    this.ctx.lineWidth = 20;
    this.ctx.globalAlpha = .2;
    this.ctx.strokeStyle = "#109486";
    for (i=0;i<20;i++)
    {
       this.ctx.beginPath();
       this.ctx.moveTo(this.width + (1.8 * this.width) - (300 * i), this.height);
       this.ctx.lineTo((0.4 * this.width) - (300 * i), 0);
       this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
    
    


    this.ctx.strokeStyle = "#15dbc4";
    for (i=0;i<70;i++)
    {
       this.ctx.lineWidth = 1;
       this.ctx.beginPath();
       this.ctx.moveTo((-0.5 * this.width) + (140 * i) - ((this.time * 100) % (30 * 200)), this.height);
       this.ctx.lineTo((-0.2 * this.width) + (140 * i) - ((this.time * 100) % (30 * 200)), 0);
       this.ctx.stroke();
    }

    
    this.ctx.lineWidth = 20;
    this.ctx.globalAlpha = .2;
    this.ctx.strokeStyle = "#109486";
    for (i=0;i<70;i++)
    {
       this.ctx.beginPath();
       this.ctx.moveTo((-0.5 * this.width) + (140 * i) - ((this.time * 100) % (30 * 200)), this.height);
       this.ctx.lineTo((-0.2 * this.width) + (140 * i) - ((this.time * 100) % (30 * 200)), 0);
       this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
    


    var grd=this.ctx.createLinearGradient(0,0,0,170);
    grd.addColorStop(0,"#100839");
    grd.addColorStop(.8,"#932f6b");
    grd.addColorStop(1,"#932f6b");

    this.ctx.fillStyle=grd;
    this.ctx.beginPath();
    this.ctx.moveTo(.4 * this.width,0);
    this.ctx.lineTo(this.width,0);
    this.ctx.lineTo(this.width,.25 * this.height);

    this.ctx.fill();


 
    this.ctx.font = "60px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = .2;
    this.ctx.fillText("Mainframe Loves You", (this.width-this.ctx.measureText("Mainframe Loves You").width)/2-15, this.height/2-15);
    this.ctx.globalAlpha = 1;
    this.ctx.fillText("Mainframe Loves You", (this.width-this.ctx.measureText("Mainframe Loves You").width)/2, this.height/2);

};


StartScene.prototype.onKeyDown = function(key){
    this.music.fade(1,0,1000);
    this.game.changeScene(new TestScene(this.game));
};

StartScene.prototype.onTap = function(x,y){
    this.music.fade(1,0,1000);
    this.game.changeScene(new TestScene(this.game));
};