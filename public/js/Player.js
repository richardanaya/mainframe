var Player = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.sightRadius = 5;
    this.image = Resources.images.player;
    var r = Math.random();
    if(r<.33){
        this.setupScientist();
    }
    else if(r<.66){
        this.setupHacker();
    }
    else {
        this.setupSamurai();
    }

    this.image = Resources.images.player;
    this.isAutoMoving = false;
    this.tags = ["solid","player"];
    this.inventory = [];
    this.activeRoom = null;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.setupScientist = function(){

    this.image_idle_0 = Resources.getImage("scientist_1");
    this.image_idle_1 = Resources.getImage("scientist_1");
}

Player.prototype.setupHacker = function(){
    this.image_idle_0 = Resources.getImage("hacker_1");
    this.image_idle_1 = Resources.getImage("hacker_2");
}

Player.prototype.setupSamurai = function(){
    this.image_idle_0 = Resources.getImage("street_samurai");
    this.image_idle_1 = Resources.getImage("street_samurai_2");
}

Player.prototype.move = function(x,y){
    if(this.level.isPointWithin(x,y) ){
        var t = this.level.getTileAt(x,y);
        if(t.type == Level.Types.Wall || t.type == Level.Types.Prop ){
            return;
        }

        var monsters = this.level.getObjectsByTypeOnTile(x,y,"monster");
        if(monsters.length > 0){
            this.moves.push(new Attack(this,monsters[0]));
        }
        else {
            this.moves.push(new Move(x,y,this));
        }
        if(x<this.x){
            this.flipped = true;
        }
        else {
            this.flipped = false;
        }

        this.explore();
    }
}


Player.prototype.getInventoryWithTag = function(t){
    var j = [];
    for(var i = 0 ; i < this.inventory.length; i++){
        if(this.inventory[i].tags.indexOf(t) != -1){
            j.push(this.inventory[i]);
        }
    }
    return j;
}

Player.prototype.attack = function(o){
    this.moves.push(new Attack(this,o));
}

Player.prototype.pickup = function(o){
    this.moves.push(new Pickup(this,o));
}

Player.prototype.explore = function(){
    var standingTile = this.level.getTileAt( this.x, this.y );
    this.activeRoom = standingTile.room;

    for( var sightCheckY = this.y-this.sightRadius; sightCheckY < this.y+this.sightRadius; sightCheckY++ ) {
        for( var sightCheckX = this.x-this.sightRadius; sightCheckX < this.x+this.sightRadius; sightCheckX++ ) {
            var diff = { x: sightCheckX-this.x, y: sightCheckY-this.y };
            var dist2 = diff.x*diff.x+diff.y*diff.y;
            if( dist2 < this.sightRadius*this.sightRadius ) {
                var seeTile = this.level.getTileAt(sightCheckX,sightCheckY);
                if( seeTile != null && seeTile != undefined ) {
                    seeTile.explored = true;
                }
            }
        }
    }
}

Player.prototype.stopAutoMove = function(){
    this.isAutoMoving = false;
}

Player.prototype.addToInventory = function(i){
    this.inventory.push(i);
}

Player.prototype.removeInventory = function(i){
    var i = this.inventory.indexOf(i);
    if(i != -1){
        this.inventory.slice(i,1);
    }
}

Player.prototype.autoMove = function(){
    if(this.isAutoMoving){
        var start = this.level.scene.graph.nodes[this.x][this.y];
        var end = this.level.scene.graph.nodes[this.autoMoveX][this.autoMoveY];
        var result = astar.search(this.level.scene.graph.nodes, start, end);
        /*var xOffset = (this.autoMoveX-this.x);
        if(xOffset != 0){ xOffset /= Math.abs(this.autoMoveX-this.x);}
        var yOffset = (this.autoMoveY-this.y);
        if(yOffset != 0){ yOffset /= Math.abs(this.autoMoveY-this.y);}*/

        /*
        */
        if(result.length== 0){
            this.isAutoMoving = false;
            return false;
        }
        this.move(result[0].x,result[0].y);

        return true;
    }
    this.isAutoMoving = false;
    return false;
};

Player.prototype.autoMoveTo = function(x,y){
    this.isAutoMoving = true;
    this.autoMoveX = x;
    this.autoMoveY = y;
};

