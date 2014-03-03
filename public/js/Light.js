var Light = function( id ) {
    this.strength = 2;
    this.falloff = 0.25;
    this.x = 0;
    this.y = 0;
	this.id = id;
	this.active = true;
	this.onTileLit = null;
}

Light.prototype.refresh = function( level ) {
	var neighbors = level.getNeighborTiles( this.x, this.y );
    for( var i = 0; i < neighbors.length; i++ ) {
        var tile = neighbors[i];
        this.calculateBrightness( tile, level );
    }
}

Light.prototype.calculateBrightness = function( tile, level ) {
    if( tile.visited == this.id ) return;
    tile.visited = this.id;

    var distx = tile.x - this.x;
    var disty = tile.y - this.y;
    var dirx = ( this.x == tile.x ) ? 0 : (( this.x < tile.x ) ? -1 : 1 );
    var diry = ( this.y == tile.y ) ? 0 : (( this.y < tile.y ) ? -1 : 1 );

    var dist= Math.sqrt( distx*distx+disty*disty );

    tile.brightness += Math.min( this.strength - ( this.falloff * dist ), 1 );

    if( tile.brightness > 0 ) {
		if( this.onTileLit != null ) {
			this.onTileLit( tile, tile.brightness );
		}

        var neighbors = level.getNeighborTiles( tile.x, tile.y );
        for( var i = 0; i < neighbors.length; i++ ) {
            var nextTile = neighbors[i];
            this.calculateBrightness( nextTile, level );
        }      
    }
}