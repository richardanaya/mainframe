var HackScene = function(game, returnScene, playerImage){
    this.game = game;
    this.returnScene = returnScene;
    this.playerImage = playerImage;
    this.mode = "play";
    this.time = 0;
    this.failTimer = 60.0;
    this.backgroundColor = "#9900FF";
    this.phasingIn = true;
    this.phaseInSpeed = 1.5;
};

HackScene.prototype = Object.create(Scene.prototype);

HackScene.prototype.update = function(delta){
    this.time += delta;
    
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.width,this.height);
    
    if (this.time >= this.phaseInSpeed)
    {
        this.phasingIn = false;
    }

    if (this.phasingIn == true)
    {
        this.ctx.strokeStyle = "#15dbc4";
        this.ctx.lineWidth = 1;
        for (i=0; i<11;i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(i * (this.width/20) + this.width/4, 0);
            this.ctx.lineTo(i * (this.width/20) + this.width/4, 0 + (this.time/this.phaseInSpeed) * (this.height/2));
            this.ctx.stroke();
        }

        
        for (i=0; i<11;i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(i * (this.width/20) + this.width/4, this.height);
            this.ctx.lineTo(i * (this.width/20) + this.width/4, this.height - ((this.time/this.phaseInSpeed) * (this.height/2)));
            this.ctx.stroke();
        }
        
    
        for (i=0; i<9;i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * (this.height/10) + this.height * .1);
            this.ctx.lineTo(0 + (this.time/this.phaseInSpeed) * (this.width/2), i * (this.height/10) + this.height * .1);
            this.ctx.stroke();
        }

        for (i=0; i<9;i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.width, i * (this.height/10) + this.height * .1);
            this.ctx.lineTo(this.width - ((this.time/this.phaseInSpeed) * (this.width/2)), i * (this.height/10) + this.height * .1);
            this.ctx.stroke();
        }
        
    }

    if (this.phasingIn == false)
    {
        this.failTimer -= delta;

        this.ctx.font = "12px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 1;
        this.ctx.fillText("Intrusion detected in:", 10, 25);
        this.ctx.fillText(Math.ceil(this.failTimer).toString(), 10, 50);

        this.ctx.strokeStyle = "#15dbc4";
        this.ctx.lineWidth = 1;
        for (i=0; i<11;i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(i * (this.width/20) + this.width/4, this.height * .1);
            this.ctx.lineTo(i * (this.width/20) + this.width/4, this.height * .9);
            this.ctx.stroke();
        }
    
        for (i=0; i<9;i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.width/4, i * (this.height/10) + this.height * .1);
            this.ctx.lineTo(10 * (this.width/20) + this.width/4, i * (this.height/10) + this.height * .1);
            this.ctx.stroke();
        }

        this.ctx.drawImage(this.playerImage,(this.width)/2,(this.height)/2,50,50);
    }
};


HackScene.prototype.onKeyDown = function(key){
    
};

HackScene.prototype.onTap = function(x,y){

};