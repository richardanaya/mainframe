var Light = function( id, x, y, strength, falloff ) {
    this.strength = strength;
    this.falloff = falloff;
    this.x = x;
    this.y = y;
	this.id = id;
	this.room = null;
	this.onTileLit = null;
}

Light.prototype.refresh = function( level ) {
    if( this.room == null || this.room == level.activeRoom ) {
    	var neighbors = level.getNeighborTiles( this.x, this.y );
        for( var i = 0; i < neighbors.length; i++ ) {
            var tile = neighbors[i];
            this.calculateBrightness( tile, level );
        }
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
    if( dist < 2 )
    {
        tile.brightness += Math.min( this.strength, 1 );
    }
    else
    {
        var compBright = Math.max( 1-(dist*this.falloff), 0 );
        var avg = 0;
        var tileh = level.getTileAt( tile.x+dirx );
        var tilev = level.getTileAt( tile.y+diry );
        if( tilev != null && tilev != undefined && tilev.type != Level.Types.Wall && tilev.type != Level.Types.Prop ) {
            compBright += tilev.brightness;
            avg++;
        }
        if( tileh != null && tileh != undefined && tileh.type != Level.Types.Wall && tileh.type != Level.Types.Prop ) {
            compBright += tileh.brightness;
            avg++;
        }

        if( compBright > 0 && avg > 0 ) {
            compBright = compBright / avg;
        }

        tile.brightness += Math.min( compBright, 1 );
    }

    tile.brightness = Math.min( tile.brightness, 1 );

    if( tile.brightness > 0 ) {
		tile.explored = true;
        if( tile.type == Level.Types.Floor ) {
            var neighbors = level.getNeighborTiles( tile.x, tile.y );
            for( var i = 0; i < neighbors.length; i++ ) {
                var nextTile = neighbors[i];
                this.calculateBrightness( nextTile, level );
            }      
        }
    }
}