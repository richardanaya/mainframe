var Level = function() {
	this.tileset = null;
    this.tiles = [];
    this.width = 10;
    this.height = 10;
    this.allObjects = [];
    this.center = { x: Math.floor( this.width/2), y: Math.floor( this.height/2 ) };
    this.activeRoom = null;
    this.rooms = [];
    this.tjoins = [];
    this.lights = [];
    this.maxRoomDepth = 0;
}

Level.Types = {
    None : 0,
    Floor : 1,
	Wall : 2,
	Door: 3,
    Debug: 4,
    Prop: 5,
};

Level.WallTypes = {
    Pillar : 0,
    EndCap: 1,
    Straight : 2,
    Corner : 3,
    TJoin : 4,
    Cross: 5
};

Level.prototype.forEachTile = function( func ) {
    for( var i = 0; i < this.tiles.length; i++ ) {
        if( this.tiles[i] != null && this.tiles[i] != undefined ) {
            func( this.tiles[i] );
        }
    }
}

Level.prototype.getTileAt = function(x,y) {
    return this.tiles[y*this.width+x];
};

Level.prototype.getNeighborTiles = function(x,y) {
    var t = [];
    if(this.isPointWithin(x-1,y-1)){
        t.push(this.getTileAt(x-1,y-1));
    }
    if(this.isPointWithin(x,y-1)){
        t.push(this.getTileAt(x,y-1));
    }
    if(this.isPointWithin(x+1,y-1)){
        t.push(this.getTileAt(x+1,y-1));
    }
    if(this.isPointWithin(x+1,y)){
        t.push(this.getTileAt(x+1,y));
    }
    if(this.isPointWithin(x+1,y+1)){
        t.push(this.getTileAt(x+1,y+1));
    }
    if(this.isPointWithin(x,y+1)){
        t.push(this.getTileAt(x,y+1));
    }
    if(this.isPointWithin(x-1,y+1)){
        t.push(this.getTileAt(x-1,y+1));
    }
    if(this.isPointWithin(x-1,y)){
        t.push(this.getTileAt(x-1,y));
    }
    return t;
};

Level.prototype.getNeighborsByType = function(x,y,type) {
    var neighbors = this.getNeighborTiles(x,y);
    var result = [];
    for( var i = 0; i < neighbors.length; i++ ) {
        var tile = neighbors[i];
        if( tile != null && tile != undefined && tile.type == type ) {
            result.push( tile );
        }
    }

    return result;
}

Level.prototype.getOrdinalNeighbors = function(x,y) {
    var t = [];
    if(this.isPointWithin(x,y-1)){
        t.push(this.getTileAt(x,y-1));
    }
    if(this.isPointWithin(x+1,y)){
        t.push(this.getTileAt(x+1,y));
    }
    if(this.isPointWithin(x,y+1)){
        t.push(this.getTileAt(x,y+1));
    }
    if(this.isPointWithin(x-1,y)){
        t.push(this.getTileAt(x-1,y));
    }
    return t;
}

Level.prototype.getOrdinalNeighborsByType = function(x,y,type ) {
    var neighbors = this.getOrdinalNeighbors(x,y);
    var result = [];
    for( var i = 0; i < neighbors.length; i++ ) {
        var tile = neighbors[i];
        if( tile != null && tile != undefined && tile.type == type ) {
            result.push( tile );
        }
    }

    return result;
}

Level.prototype.getOrdinalNeighborsByWallType = function(x,y,type ) {
    var neighbors = this.getOrdinalNeighbors(x,y);
    var result = [];
    for( var i = 0; i < neighbors.length; i++ ) {
        var tile = neighbors[i];
        if( tile != null && tile != undefined && tile.type == Level.Types.Wall && tile.wallType == type ) {
            result.push( tile );
        }
    }

    return result;
}

Level.prototype.getGraph = function() {
    var graph = [];
    for(var x = 0; x < this.width; x++){
        var row = [];
        for(var y = 0; y < this.height; y++){
            var t = this.getTileAt(x,y);
            if(!t || t.type == Level.Types.Wall || t.type == Level.Types.Prop || t.explored == false ){
                row.push(0);
            }
            else {
                row.push(1);
            }
        }
        graph.push(row);
    }
    return new Graph(graph);
};

Level.prototype.getNeighborTileObjects = function(x,y) {
    var o = [];
    var t = this.getNearbyTiles(x,y);
    for(var i = 0 ; i < t.length; i++){
        o = o.concat(t.objects);
    }
    return o;
};

Level.prototype.getNeighborObjectsByType = function(x,y,type){
    var o = [];
    var ts = this.getNeighborTiles(x,y);
    for(var j = 0 ; j < ts.length; j++){
        var t = ts[j];
        for(var i = 0 ; i < t.objects.length; i++){
            if(t.objects[i].tags.indexOf(type)!=-1){
                o.push(t.objects[i]);
            }
        }
    }

    return o;
}

Level.prototype.addObjectTo = function(x,y,o) {
    this.getTileAt(x,y).objects.push(o);
    o.level = this;
    if( o.onLevelSet != null && o.onLevelSet != undefined ) {
        o.onLevelSet( this );
    }
    o.x = x;
    o.y = y;
    this.allObjects.push(o);
};

Level.prototype.isPointWithin = function(x,y) {
    if(x>=0&&x<this.width&&y>=0&&y<this.height){
    var t = this.getTileAt(x,y);
        if(t){
            return true;
        }
        else {
            return false;
        }
    }

};

Level.prototype.moveTo = function(x,y,o) {
    this.removeFrom(o.x, o.y, o);
    this.addObjectTo(x,y,o);
};

Level.prototype.removeObject = function(o){
    this.removeFrom(o.x, o.y, o);
}

Level.prototype.removeFrom = function(x,y,o) {
    var t = this.getTileAt(x,y);
    var i = t.objects.indexOf(o);
    o.x = -1;
    o.y = -1;

    if (i > -1) {
        t.objects.splice(i, 1);
    }
    else {
        console.log("trying to remove object that doesn't exist");
    }


    i = this.allObjects.indexOf(o);

    if (i > -1) {
        this.allObjects.splice(i, 1);
    }
    else {
        console.log("trying to remove object that doesn't exist");
    }
};

Level.prototype.getObjectsAt = function(x,y){
    return this.getTileAt(x,y).objects;
}

Level.prototype.getObjectsByTypeOnTile = function(x,y,type){
    var t = this.getTileAt(x,y);
    var o = [];
	if( t == null || t == undefined ) return o;

    for(var i = 0 ; i < t.objects.length; i++){
        if(t.objects[i].tags.indexOf(type)!=-1){
            o.push(t.objects[i]);
        }
    }
    return o;
}

Level.prototype.update = function() {
}

Level.prototype.refreshLights = function( dynamicLights ) {
    this.forEachTile( function( tile ) {
            tile.visited = null;
            tile.brightness = 0;
        });

    for( var i = 0; i < this.lights.length; i++ ) {
        this.lights[i].refresh( this );
    }

    if( dynamicLights != null && dynamicLights != undefined && dynamicLights.length > 0 ) {
        for( var i = 0; i < dynamicLights.length; i++ ) {
            dynamicLights[i].refresh( this );
        }
    }
}

Level.prototype.designRooms = function(height) {
    /*var startRoom = this.getRoomByDepth(0);
    var upElevatorPos = this.getRandomWall(startRoom);
    this.addObjectTo(upElevatorPos.x,upElevatorPos.y,new UpElevator());
    this.getTileAt(upElevatorPos.x,upElevatorPos.y).type = Level.Types.Floor;*/
    var endRoom = this.getRoomByDepth(this.maxRoomDepth);
    var downElevatorPos = this.getRandomWall(endRoom);
    this.addObjectTo(downElevatorPos.x,downElevatorPos.y,new DownElevator());
    this.getTileAt(downElevatorPos.x,downElevatorPos.y).type = Level.Types.Floor;

    var itemsForLevel = [];
    for(var i in Pickupable.Items){
        if(Pickupable.Items[i].levels && Pickupable.Items[i].levels.indexOf(this.levelDepth)!=-1){
            itemsForLevel.push(i);
        }
    }
    for(var j = 0 ; j < this.maxRoomDepth/2; j++){
        this.placeItemInRandomSpot(Pickupable.load(itemsForLevel[Math.floor(Math.random()*itemsForLevel.length)]));
    }

    var monstersForLevel = [];
    for(var i in Monster.List){
        if(Monster.List[i].levels && Monster.List[i].levels.indexOf(this.levelDepth)!=-1){
            monstersForLevel.push(i);
        }
    }
    for(var j = 0 ; j < this.maxRoomDepth/2; j++){
        this.placeItemInRandomSpot(Monster.load(monstersForLevel[Math.floor(Math.random()*monstersForLevel.length)]));
    }
    this.placeItemInRandomSpot(Pickupable.load("lab_note_"+this.levelDepth));
}

Level.prototype.placeItemInRandomSpot = function(item){
    var room = this.getRandomRoom()
    var pos = this.getRandomFreeTile(room);
    this.addObjectTo(pos.x,pos.y,item);
}

Level.prototype.getRandomRoom = function(){
    return this.rooms[Math.floor(this.rooms.length*Math.random())];
}

Level.prototype.getRoomByDepth = function(depth) {
    for(var i = 0 ; i < this.rooms.length; i++){
        if(this.rooms[i].depth == depth){
            return this.rooms[i];
        }
    }
    return null;
}

Level.prototype.getRandomFreeTile = function(room) {
    var x = Utilities.randRangeInt( room.x+1, room.x+room.width-1 );
    var y = Utilities.randRangeInt( room.y+1, room.y+room.height-1 );
    while(!this.isFreeTile(x,y)){
        x = Utilities.randRangeInt( room.x+1, room.x+room.width-1 );
        y = Utilities.randRangeInt( room.y+1, room.y+room.height-1 );
    }
    return {x:x,y:y};
};

Level.prototype.getRandomWall = function(room) {
     var f = function(){
         return {x:Utilities.randRangeInt( room.x, room.x+room.width-1 ), y:room.y-1};
    };
    var p = f();
    /*while(this.getNeighborsByType(p.x, p.y,Level.Types.Floor)==0){
        p = f();
    }*/
    return p;
};

Level.prototype.isWithinRoom = function(room,x,y) {
    if(x>=room.x && x<room.x+room.width&&x>=room.y && y<room.y+room.height){
        return true;
    }
    return false;
};

Level.prototype.isFreeTile = function(x,y) {
    var t = this.getTileAt(x,y);
    return (t.type != Level.Types.Prop && t.type != Level.Types.Wall);
}

Level.isOfficeHeight = function(h){
    return (h<=900 && h>=700);
}

Level.isLabHeight = function(h){
    return (h<=600 && h>=400);
}

Level.isBasementHeight = function(h){
    return (h<=300 && h>=100);
}

Level.isMainframeHeight = function(h){
    return (h==0);
}

