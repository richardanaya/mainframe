var Level = function() {
    this.tiles = [];
    this.width = 10;
    this.height = 10;
    this.allObjects = [];
    for(var x = 0; x < this.width; x++){
        for(var y = 0; y < this.height; y++){
            this.tiles[y*this.width+x] = {type: Level.Types.Floor, image: Resources.images.grass, objects:[]};
        }
    }
}

Level.Types = {
    Floor : 0
};

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
    o.x = x;
    o.y = y;
    this.allObjects.push(o);
};

Level.prototype.isPointWithin = function(x,y) {
    return (x>=0&&x<this.width&&y>=0&&y<this.height);
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
    for(var i = 0 ; i < t.objects.length; i++){
        if(t.objects[i].tags.indexOf(type)!=-1){
            o.push(t.objects[i]);
        }
    }
    return o;
}