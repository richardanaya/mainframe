var TestScene = function(game){
    this.game = game;
    this.player = new Player();
    this.currentHeight = 1000
    this.loadLevel(this.currentHeight)
    this.mode = "play";
    this.infoText = [];
    this.time = 0;
    //this.showDialog("There's a robot! quick, kill it!");
    this.size = 64;
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.loadLevel = function(height){
    this.player.stopAutoMove();
    this.level = this.game.GetLevel(height);
	/*
    this.level.addObjectTo(5,5,new Robot());
    var upElevator = new UpElevator();
    this.level.addObjectTo(Math.floor(Math.random()*9), Math.floor(Math.random()*9),upElevator);
    var downElevator = new DownElevator();
    this.level.addObjectTo(Math.floor(Math.random()*9), Math.floor(Math.random()*9),downElevator);
    if(height<=this.currentHeight){
        this.level.addObjectTo(upElevator.x,upElevator.y,this.player);
    }
    else {
        this.level.addObjectTo(downElevator.x,downElevator.y,this.player);
    }
    */
    this.level.scene = this;
    this.currentHeight = height;
};

TestScene.prototype.update = function(delta){
    this.time += delta;
    for(var x = 0; x < this.level.width; x++){
        for(var y = 0; y < this.level.width; y++){
            var t = this.level.tiles[this.level.width*y+x];
			if( t != null && t != undefined ) {
				if( t.image != null && t.image != undefined ) {
            		this.ctx.drawImage(t.image,x*this.size ,y*this.size,this.size ,this.size  );
				}
				for(var i = 0 ; i < t.objects.length; i++){
                	this.ctx.drawImage(t.objects[i].image,x*this.size ,y*this.size,this.size ,this.size  );
            	}
			}
        }
    }

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.currentHeight,this.width-80, 30);


    if(this.mode == "dialog"){

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,200,100);

        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.dialogText,20,20);
    }
};

TestScene.prototype.processAllMoves = function(){
    var moves = [];
    for(var i = 0 ; i < this.level.allObjects.length; i++){
        if(this.level.allObjects[i].thinks){
            moves = moves.concat(this.level.allObjects[i].think());
        }
    }
    var _this = this;

    var i = 0;
    var process = function(i){
        if(i>= moves.length){
            if(_this.player.autoMove()){
                setTimeout(function(){
                    _this.processAllMoves();
                },100);
            }
            return;
        }
        moves[i].process(function(){process(i+1);});
    }
    process(0);
}

TestScene.prototype.onKeyDown = function(key){
    if(this.mode == "play"){
        if(key == 37){
            this.player.moveLeft();
        }
        else if(key == 38){
            this.player.moveUp();
        }
        else if(key == 39){
            this.player.moveRight();
        }
        else if(key == 40){
            this.player.moveDown();
        }
        this.processAllMoves();
    }
    else if(this.mode == "dialog"){
        this.mode = "play";
    }
};


TestScene.prototype.onTouchDown = function(x,y){
    if(this.mode == "play"){
        var moveToX = x/this.size ;
        var moveToY = y/this.size ;
        if(this.level.isPointWithin(moveToX,moveToY)){
            this.player.autoMoveTo(Math.floor(moveToX),Math.floor(moveToY));
            this.player.autoMove();
            this.processAllMoves();
        }
    }
    else if(this.mode == "dialog"){
        this.mode = "play";
    }
}

TestScene.prototype.showDialog = function(text){
    this.mode = "dialog";
    this.dialogText = text;
}

TestScene.prototype.showInfoText = function(text){
    this.infoText.push({text:text,time:this.time});
}
