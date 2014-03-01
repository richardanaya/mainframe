var TestScene = function(game){
    this.game = game;
    this.level = this.game.GetLevel(1000);
    this.player = new Player();
    this.level.addObjectTo(0,0,this.player);
    this.level.addObjectTo(5,5,new Robot());
    this.mode = "play";
    this.infoText = [];
    this.time = 0;
    this.showDialog("There's a robot! quick, kill it!");
    this.size = 64;
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.update = function(delta){
    this.time += delta;
    for(var x = 0; x < this.level.width; x++){
        for(var y = 0; y < this.level.width; y++){
            var t = this.level.tiles[this.level.width*y+x];
            this.ctx.drawImage(t.image,x*this.size ,y*this.size,this.size ,this.size  );
            for(var i = 0 ; i < t.objects.length; i++){
                this.ctx.drawImage(t.objects[i].image,x*this.size ,y*this.size,this.size ,this.size  );
            }
        }
    }

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
        moves = moves.concat(this.level.allObjects[i].think());
    }
    for(var i = 0 ; i < moves.length ; i++){
        moves[i].process();
    }
    if(this.player.autoMove()){
        var _this = this;
        setTimeout(function(){
            _this.processAllMoves();
        },100);

    }
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
        this.player.autoMoveTo(Math.floor(moveToX),Math.floor(moveToY));
        this.player.autoMove();
        this.processAllMoves();
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
