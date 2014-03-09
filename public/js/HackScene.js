var HackScene = function(game, returnScene, playerImage, difficulty){
    this.game = game;
    this.returnScene = returnScene;
    this.playerImage = playerImage;
    this.mode = "play";
    this.time = 0;
    this.failTimer = 60.0;
    this.music = new Howl({
        urls: ['sounds/sfx_general/sfx_computer_on.mp3'],
        loop: false
        }).play();
    this.phasingIn = true;
    this.phaseInSpeed = 1.0;
    this.minimumSquareSize = 40;
    this.squareSize = 0;
    this.upLeftGridCornerX = 0;
    this.upLeftGridCornerY = 0;
    this.gridObjectSize = 0;
    this.gridObjectPadding = 1;

    this.playerGridPosX = 1,
    this.playerGridPosY = 1;

    this.goalGridPosX = 9;
    this.goalGridPosY = 7;

    this.difficulty = difficulty;

    this.grid;

    if (this.difficulty == 1)
    {
        this.grid = new HackGrid(10,10,this);
    }

    this.whoseTurn = "player";

    this.playerActionThrottle = 0.1;
    this.timeSinceTurn = 0.0;

    this.grid.createNewNode(1,1,"player");

    this.grid.createNewNode(8,8,"goal");

    this.grid.createNewNode(5,2,"neutral");
    this.grid.createNewNode(0,9,"neutral");


};

HackScene.prototype = Object.create(Scene.prototype);

HackScene.prototype.update = function(delta){
    this.time += delta;
    this.timeSinceTurn += delta;

    if (this.timeSinceTurn >= this.playerActionThrottle)
    {
        this.whoseTurn = "player";
    }
    
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.width,this.height);

    if (this.width/(this.grid.maxGridX +1) < this.minimumSquareSize || this.height/(this.grid.maxGridY + 2) < this.minimumSquareSize )
    {
        this.squareSize = this.minimumSquareSize;
    }
    else
    {
        this.squareSize = Math.min(this.width/(this.grid.maxGridX +1), this.height/(this.grid.maxGridY + 2));
    }


    this.gridObjectSize = this.squareSize - (this.gridObjectPadding * 2);

    if (this.width/4 > 300)
    {
        this.upLeftGridCornerX = this.width/4;
    }
    else
    {   
        this.upLeftGridCornerX = 300;
    }

    this.upLeftGridCornerY = this.height * .05;
    
    if (this.time >= this.phaseInSpeed)
    {
        this.phasingIn = false;
    }

    if (this.phasingIn)
    {
        this.ctx.strokeStyle = "#15dbc4";
        this.ctx.lineWidth = 1;
        //draw lines from top to bottom
        for (i=0; i<this.grid.xGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.upLeftGridCornerX + (i * this.squareSize), 0);
            this.ctx.lineTo(this.upLeftGridCornerX + (i * this.squareSize), 0 + (this.time/this.phaseInSpeed) * (this.height/2));
            this.ctx.stroke();
        }

        //draw lines from bottom to top
        for (i=0; i<this.grid.xGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.upLeftGridCornerX + (i * this.squareSize), this.height);
            this.ctx.lineTo(this.upLeftGridCornerX + (i * this.squareSize), this.height - ((this.time/this.phaseInSpeed) * (this.height/2)));
            this.ctx.stroke();
        }
        
        //draw lines from left to right
        for (i=0; i<this.grid.yGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.upLeftGridCornerY + (i * this.squareSize));
            this.ctx.lineTo(0 + (this.time/this.phaseInSpeed) * (this.width/2), this.upLeftGridCornerY + (i * this.squareSize));
            this.ctx.stroke();
        }

        //draw lines from right to left
        for (i=0; i<this.grid.yGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.width, i * this.squareSize + this.upLeftGridCornerY);
            this.ctx.lineTo(this.width - ((this.time/this.phaseInSpeed) * (this.width/2)), i * this.squareSize + this.upLeftGridCornerY);
            this.ctx.stroke();
        }
        
    }

    if (!this.phasingIn)
    {
        this.failTimer -= delta;

        this.ctx.font = "12px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 1;
        this.ctx.fillText("Intrusion detected in:", 10, 25);
        this.ctx.fillText(Math.ceil(this.failTimer).toString() + " seconds", 10, 50);

        this.ctx.strokeStyle = "#15dbc4";
        this.ctx.lineWidth = 1;

        //draw lines from top to bottom
        for (i=0; i<this.grid.xGridLineCount; i++)
        {
            
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.squareSize + this.upLeftGridCornerX, this.upLeftGridCornerY);
            this.ctx.lineTo(i * this.squareSize + this.upLeftGridCornerX, this.upLeftGridCornerY + (this.squareSize * (this.grid.maxGridY +1 )));
            this.ctx.stroke();
        }
    
        //draw lines from left to right
        for (i=0; i<this.grid.yGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.upLeftGridCornerX, i * this.squareSize + this.upLeftGridCornerY);
            this.ctx.lineTo((this.grid.maxGridX + 1) * this.squareSize + this.upLeftGridCornerX, i * this.squareSize + this.upLeftGridCornerY);
            this.ctx.stroke();
        }

        /*
        this.ctx.fillStyle = "yellow";
        this.ctx.fillRect(this.upLeftGridCornerX + (this.grid.goalX * this.squareSize) + this.gridObjectPadding,
                          this.upLeftGridCornerY + (this.grid.goalY * this.squareSize) + this.gridObjectPadding,
                          this.gridObjectSize, 
                          this.gridObjectSize);
        */

        this.ctx.drawImage(this.playerImage,
                           this.upLeftGridCornerX + (this.playerGridPosX * this.squareSize) + this.gridObjectPadding,
                           this.upLeftGridCornerY + (this.playerGridPosY * this.squareSize) + this.gridObjectPadding,
                           this.gridObjectSize, 
                           this.gridObjectSize);

        this.grid.update(delta);
    }
};


HackScene.prototype.onKeyDown = function(key){
    if (!this.phasingIn && this.whoseTurn == "player")
    {
        if((key == 37 && this.playerGridPosX > this.grid.minGridX) || (key == 65 && this.playerGridPosX > this.grid.minGridX))
        {
            this.playerGridPosX--;
            this.whoseTurn = "enemy";
            this.timeSinceTurn = 0.0;
        }
        else if((key == 38 && this.playerGridPosY > this.grid.minGridY) || (key == 87 && this.playerGridPosY > this.grid.minGridY))
        {
            this.playerGridPosY--;
            this.whoseTurn = "enemy";
            this.timeSinceTurn = 0.0;
        }
        else if((key == 39 && this.playerGridPosX < this.grid.maxGridX) || (key == 68 && this.playerGridPosX < this.grid.maxGridX))
        {
            this.playerGridPosX++;
            this.whoseTurn = "enemy";
            this.timeSinceTurn = 0.0;
        }
        else if((key == 40 && this.playerGridPosY < this.grid.maxGridY) || (key == 83 && this.playerGridPosY < this.grid.maxGridY)) 
        {
            this.playerGridPosY++;
            this.whoseTurn = "enemy";
            this.timeSinceTurn = 0.0;
        }
    }
};

HackScene.prototype.onTap = function(x,y){

};

HackScene.prototype.drawCircleAtGridPos = function(x,y,type)
{   
    var color = "purple";

    if(type == "player")
        color = "green";
    else if (type == "goal")
        color = "yellow";
    else if (type == "neutral")
        color = "blue";

    this.ctx.beginPath();
    this.ctx.arc(this.upLeftGridCornerX + (x * this.squareSize) + (0.5 * this.squareSize), 
                 this.upLeftGridCornerY + (y * this.squareSize) + (0.5 * this.squareSize), 
                 this.squareSize * 0.5, 
                 0, 
                 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
};

HackScene.prototype.lineConnectTwoGridObjects = function(x1,y1, x2, y2)
{
    this.ctx.strokeStyle = "#15dbc4";
    this.ctx.lineWidth = 1;
    
    for (i=0; i<this.grid.xGridLineCount; i++)
    {
            this.ctx.beginPath();
            this.ctx.moveTo(this.upLeftGridCornerX + (x1 * this.squareSize) + (0.5 * this.squareSize), 
                            this.upLeftGridCornerX + (y1 * this.squareSize) + (0.5 * this.squareSize));
            this.ctx.lineTo(this.upLeftGridCornerX + (x2 * this.squareSize) + (0.5 * this.squareSize), 
                            this.upLeftGridCornerX + (y2 * this.squareSize) + (0.5 * this.squareSize));
            this.ctx.stroke();
    }
}