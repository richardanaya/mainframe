var Level = function() {
	this.tileset = null;
    this.tiles = [];
    this.width = 10;
    this.height = 10;
    this.allObjects = [];
}

Level.Types = {
    Floor : 0,
	Wall : 1,
	Connector: 2
};

Level.prototype.getTileAt = function(x,y) {
    return this.tiles[y*this.width+x];
};

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
