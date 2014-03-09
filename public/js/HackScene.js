var HackScene = function(game, returnScene, playerImage, difficulty){
    this.game = game;
    this.returnScene = returnScene;
    this.playerImage = playerImage;
    this.mode = "play";
    this.mainframeEnmity = 5.0;
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

    this.difficulty = difficulty;

    this.grid = HackGridGenerator.generate( 10, 10, this, this.difficulty );

    this.whoseTurn = "player";

    this.playerActionThrottle = 0.1;
    this.timeSinceTurn = 0.0;
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

    if (this.width/4 > 400)
    {
        this.upLeftGridCornerX = this.width/4;
    }
    else
    {   
        this.upLeftGridCornerX = 400;
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
        for (var i=0; i<this.grid.xGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.upLeftGridCornerX + (i * this.squareSize), 0);
            this.ctx.lineTo(this.upLeftGridCornerX + (i * this.squareSize), 0 + (this.time/this.phaseInSpeed) * (this.height/2));
            this.ctx.stroke();
        }

        //draw lines from bottom to top
        for (var i=0; i<this.grid.xGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(this.upLeftGridCornerX + (i * this.squareSize), this.height);
            this.ctx.lineTo(this.upLeftGridCornerX + (i * this.squareSize), this.height - ((this.time/this.phaseInSpeed) * (this.height/2)));
            this.ctx.stroke();
        }
        
        //draw lines from left to right
        for (var i=0; i<this.grid.yGridLineCount; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.upLeftGridCornerY + (i * this.squareSize));
            this.ctx.lineTo(0 + (this.time/this.phaseInSpeed) * (this.width/2), this.upLeftGridCornerY + (i * this.squareSize));
            this.ctx.stroke();
        }

        //draw lines from right to left
        for (var i=0; i<this.grid.yGridLineCount; i++)
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

        /*
        this.ctx.font = "12px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 1;
        this.ctx.fillText("Intrusion detected in:", 10, 25);
        this.ctx.fillText(Math.ceil(this.failTimer).toString() + " seconds", 10, 50);
        */

        this.ctx.strokeStyle = "#15dbc4";
        this.ctx.lineWidth = 1;

        //draw lines from top to bottom
        for (var i=0; i<this.grid.xGridLineCount; i++)
        {
            
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.squareSize + this.upLeftGridCornerX, this.upLeftGridCornerY);
            this.ctx.lineTo(i * this.squareSize + this.upLeftGridCornerX, this.upLeftGridCornerY + (this.squareSize * (this.grid.maxGridY +1 )));
            this.ctx.stroke();
        }
    
        //draw lines from left to right
        for (var i=0; i<this.grid.yGridLineCount; i++)
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

        this.grid.hackingSimulationUpdate(delta);
        this.grid.updateBacktraceHighlights(delta);
        this.grid.updateNodeConnectionLines(delta);
        this.grid.update(delta);

        this.drawBox(10,10,this.upLeftGridCornerX - 20,this.height - 20);

        if (this.mainframeEnmity == 0)
        {
            this.ctx.font = "14px 'Press Start 2P'";
            this.ctx.fillStyle = "green";
            this.ctx.globalAlpha = 1;
            this.ctx.fillText("Currently Undetected", 30, 40);
        }
        else
        {
            this.ctx.font = "14px 'Press Start 2P'";
            this.ctx.fillStyle = "red";
            this.ctx.globalAlpha = 1;
            this.ctx.fillText("INTRUSTION DETECTED", 30, 40);
            this.ctx.fillText("Mainframe Enmity: " + this.mainframeEnmity + "%", 30, 60);
        }

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

HackScene.prototype.onTap = function(x,y)
{
    var xGridClick = -99;
    var yGridClick = -99;

    for (var i = 0; i < this.grid.xSize; i++)
    {
        if ((xGridClick == -99) &&
            (x > (i * this.squareSize + this.upLeftGridCornerX)) && 
            (x < ((i + 1) * this.squareSize + this.upLeftGridCornerX)))
        {
            xGridClick = i;
        }
    }

    for (var i = 0; i < this.grid.ySize; i++)
    {
        if ((yGridClick == -99) &&
            (y > (i * this.squareSize + this.upLeftGridCornerY)) && 
            (y < ((i + 1) * this.squareSize + this.upLeftGridCornerY)))
        {
            yGridClick = i;
        }
    }

    //if(xGridClick != -99 && yGridClick != -99)
        //console.log("Mouse position is X: " + x + " Y: " + y);
        //console.log("The player clicked on grid X: " + xGridClick + " Y: " + yGridClick);

};

HackScene.prototype.drawCircleAtGridPos = function(x,y,type)
{   
    var color = "purple";

    if(type == "player")
        color = "green";
    else if (type == "goal")
        color = "yellow";
    else if (type == "neutral")
        color = "white";
    else if (type == "mainframe")
        color = "red";

    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.upLeftGridCornerX + (x * this.squareSize) + (0.5 * this.squareSize), 
                 this.upLeftGridCornerY + (y * this.squareSize) + (0.5 * this.squareSize), 
                 this.squareSize * 0.4, 
                 0, 
                 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
};

HackScene.prototype.drawBacktraceCircleAtGridPos = function(x,y)
{   
    var color = "red";

    this.ctx.globalAlpha = 0.4;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(this.upLeftGridCornerX + (x * this.squareSize) + (0.5 * this.squareSize), 
                 this.upLeftGridCornerY + (y * this.squareSize) + (0.5 * this.squareSize), 
                 this.squareSize * 0.7, 
                 0, 
                 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
};

HackScene.prototype.lineConnectTwoGridObjects = function(x1,y1, x2, y2)
{
    this.ctx.globalAlpha = 0.8;
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 10;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.upLeftGridCornerX + (x1 * this.squareSize) + (0.5 * this.squareSize), 
                            this.upLeftGridCornerY + (y1 * this.squareSize) + (0.5 * this.squareSize));
    this.ctx.lineTo(this.upLeftGridCornerX + (x2 * this.squareSize) + (0.5 * this.squareSize), 
                            this.upLeftGridCornerY + (y2 * this.squareSize) + (0.5 * this.squareSize));
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
};

HackScene.prototype.drawBacktraceLines = function(x1,y1, x2, y2, nodeFullyBacktraced)
{
    this.ctx.globalAlpha = 0.4;
    this.ctx.lineWidth = 25;
    
    if(nodeFullyBacktraced == true)
    {
        
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(this.upLeftGridCornerX + (x1 * this.squareSize) + (0.5 * this.squareSize), 
                                this.upLeftGridCornerY + (y1 * this.squareSize) + (0.5 * this.squareSize));
        this.ctx.lineTo(this.upLeftGridCornerX + (x2 * this.squareSize) + (0.5 * this.squareSize), 
                                this.upLeftGridCornerY + (y2 * this.squareSize) + (0.5 * this.squareSize));
        this.ctx.stroke();
        
    }
    else if(nodeFullyBacktraced == false)
    {
        this.ctx.strokeStyle = "orange";
                this.ctx.beginPath();
        this.ctx.moveTo(this.upLeftGridCornerX + (x1 * this.squareSize) + (0.5 * this.squareSize), 
                                this.upLeftGridCornerY + (y1 * this.squareSize) + (0.5 * this.squareSize));
        this.ctx.lineTo(this.upLeftGridCornerX + (x2 * this.squareSize) + (0.5 * this.squareSize), 
                                this.upLeftGridCornerY + (y2 * this.squareSize) + (0.5 * this.squareSize));
        this.ctx.stroke();
    }
    else
        console.debug("WHAT?");

    this.ctx.globalAlpha = 1;
};

HackScene.prototype.drawBox = function(x,y,width,height)
{
    x = Math.floor(x);
    y = Math.floor(y);
    width = Math.floor(width);
    height = Math.floor(height);
    dialog_bg = Resources.getImage("dialog_bg");
    dialog_frame_bottom = Resources.getImage("dialog_frame_bottom");
    dialog_frame_bottomleft = Resources.getImage("dialog_frame_bottomleft");
    dialog_frame_bottomright = Resources.getImage("dialog_frame_bottomright");
    dialog_frame_left = Resources.getImage("dialog_frame_left");
    dialog_frame_right = Resources.getImage("dialog_frame_right");
    dialog_frame_top = Resources.getImage("dialog_frame_top");
    dialog_frame_topleft = Resources.getImage("dialog_frame_topleft");
    dialog_frame_topright = Resources.getImage("dialog_frame_topright");

    var context = this.ctx;

    context.save();
    // Draw the path that is going to be clipped
    context.beginPath();
    context.rect(x+4,y+4,width-8,height-8);
    context.clip();

    context.beginPath();
    for(var xx=0;xx<width/32;xx++){
        for(var yy=0;yy<height/32;yy++){
            this.ctx.drawImage(dialog_bg,x+xx*32,y+yy*32,32,32);
        }
    }

    context.restore();

    this.ctx.drawImage(dialog_frame_topleft,x,y,8,8);
    this.ctx.drawImage(dialog_frame_top,x+8,y,width-16,8);
    this.ctx.drawImage(dialog_frame_bottomleft,x,y+height-8,8,8);
    this.ctx.drawImage(dialog_frame_left,x,y+8,8,height-16);
    this.ctx.drawImage(dialog_frame_right,x+width-8,y+8,8,height-16);
    this.ctx.drawImage(dialog_frame_topright,x+width-8,y,8,8);
    this.ctx.drawImage(dialog_frame_bottomright,x+width-8,y+height-8,8,8);
    this.ctx.drawImage(dialog_frame_bottom,x+8,y+height-8,width-16,8);
}