var Generator = function() {
}

Generator.prototype.generateLevel = function(width,height,tileset) {
	var result = new Level();
	result.tileset = tileset;
	result.width = width;
	result.height = height;

	// generate floors
	var room = Room.createRoom( {x: Utilities.randRangeInt( 0, width), y: Utilities.randRangeInt( 0, height )}
							   , Utilities.randRangeInt(3,10) // width
							   , Utilities.randRangeInt(3,10) // height
							   , Utilities.randRangeInt( 0, 4 ) // number of connectors
							   , result
							  );
	this.addRoom( room, result );
	
	return result;
}

Generator.prototype.addRoom = function( room, level ) {
	for( var key = 0; key < room.tiles.length; ++key ) {
		var tile = room.tiles[key];
		if( tile != null && tile != undefined ) {
			level.tiles[tile.index] = { type: tile.type, image: level.tileset.floors[0], objects: [] };
		}
	}

	for( var key = 0; key < room.connectors.length; ++key ) {
		var connector = room.connectors[key];
		if( connector != null && connector != undefined ) {
			level.tiles[connector.index] = { type: Level.Types.Connector, image: level.tileset.doors.north[0], objects: [] };
		}
	}
}

var generator = new Generator();
