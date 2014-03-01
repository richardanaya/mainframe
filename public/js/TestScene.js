var TestScene = function(game){
    this.game = game;
    this.level = this.game.GetLevel(1000);
    this.player = new Player();
    this.level.addObjectTo(0,0,this.player);
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
};