var Player = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.player;
    var r = Math.random();

    this.inventory = [];
    this.strength = 10;
    this.accuracy = 10;
    this.mind = 10;

    this.image = Resources.images.player;
    this.isAutoMoving = false;
    this.tags = ["solid","player"];
    this.activeRoom = null;
    this.rangedWeapon = null;
    this.meleeWeapon = null;
    if(r<.33){
        this.setupScientist();
    }
    else if(r<.66){
        this.setupHacker();
    }
    else {
        this.setupSamurai();
    }

    this.god = false;
    var _this = this;
    new Konami(function() {
        _this.god = true;
        _this.level.scene.showInfoText("The sky above the port was the color of television, tuned to a dead channel.");
    });
    this.light = new Light( "playerlight", this.x, this.y, 1.5, 0.2 );
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.setupScientist = function(){
    this.image_idle_0 = Resources.getImage("scientist_1");
    this.image_idle_1 = Resources.getImage("scientist_2");
    this.mind = 12;
}

Player.prototype.onDie = function(){
    this.level.scene.onDie();
}

Player.prototype.setupHacker = function(){
    this.image_idle_0 = Resources.getImage("hacker_1");
    this.image_idle_1 = Resources.getImage("hacker_2");
    var g = Pickupable.load("gun");
    g.equipped = true;
    this.addToInventory(g);
    this.useRanged(g);
    this.accuracy = 11;
    this.mind = 11;
}

Player.prototype.setupSamurai = function(){
    this.image_idle_0 = Resources.getImage("street_samurai");
    this.image_idle_1 = Resources.getImage("street_samurai_2");
    var g = Pickupable.load("gun");
    g.equipped = true;
    this.addToInventory(g);
    this.useRanged(g);
    var g = Pickupable.load("bat");
    g.equipped = true;
    this.addToInventory(g);
    this.useMelee(g);
    this.strength = 11;
    this.accuracy = 11;
}

Player.prototype.useMelee = function(w){
    this.meleeWeapon = w;
}

Player.prototype.useRanged = function(w){
    this.rangedWeapon = w;
    if(this.level){
        this.level.scene.rangedButton.image = w.image;
    }
}

Player.prototype.move = function(x,y){
    if(this.level.isPointWithin(x,y) ){
        var t = this.level.getTileAt(x,y);
        if(t.type == Level.Types.Wall || t.type == Level.Types.Prop ){
            return;
        }

        var monsters = this.level.getObjectsByTypeOnTile(x,y,"monster");
        if(monsters.length > 0){
            this.moves.push(new Attack(this,monsters[0],this.meleeWeapon));
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

Player.prototype.attack = function(o,w){
    this.moves.push(new Attack(this,o,w));
}

Player.prototype.pickup = function(o){
    this.moves.push(new Pickup(this,o));
}

Player.prototype.explore = function(){
    if( this.lightRegistered == false ) {
        this.lightRegistered = true;
        this.level.lights.push( this.light );
    }

    var standingTile = this.level.getTileAt( this.x, this.y );
    this.level.activeRoom = standingTile.room;
    this.level.forEachTile( function(tile) { 
                                tile.brightness = 0; 
                                tile.visited = false; 
                            });

    standingTile.brightness = 1;
    standingTile.visited = true;
    standingTile.explored = true;

    this.light.x = this.x;
    this.light.y = this.y;
}

Player.prototype.stopAutoMove = function(){
    this.isAutoMoving = false;
}

Player.prototype.addToInventory = function(i){
    this.inventory.push(i);
    i.player = this;
}

Player.prototype.removeInventory = function(inv){
    var i = this.inventory.indexOf(inv);
    if(i != -1){
        this.inventory.splice(i,1);
    }
}

Player.prototype.rangeAttackTarget = function(x,y,obj){
    var monst = this.level.getObjectsByTypeOnTile(x,y,"monster");
    this.attack(monst[monst.length-1],this.rangedWeapon);
    this.level.scene.processAllMoves();
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

