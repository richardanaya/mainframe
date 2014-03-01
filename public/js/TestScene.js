var TestScene = function(game){
    this.game = game;
    this.level = this.game.GetLevel(1000);
    this.player = new Player();
    this.level.addObjectTo(0,0,this.player);
    this.level.addObjectTo(20,20,new Robot());
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.update = function(delta){
    for(var x = 0; x < this.level.width; x++){
        for(var y = 0; y < this.level.width; y++){
            var t = this.level.tiles[this.level.width*y+x];
            this.ctx.drawImage(t.image,x*16,y*16);
            for(var i = 0 ; i < t.objects.length; i++){
                this.ctx.drawImage(t.objects[i].image,x*16,y*16);
            }
        }
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
};


TestScene.prototype.onTouchDown = function(x,y){
    var moveToX = x/16;
    var moveToY = y/16;
    this.player.autoMoveTo(Math.floor(moveToX),Math.floor(moveToY));
    this.player.autoMove();
    this.processAllMoves();
}