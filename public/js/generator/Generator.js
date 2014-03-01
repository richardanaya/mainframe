var Generator = function() {
}

Generator.prototype.generateLevel = function(width,height,tileset) {
	var result = new Level();
	result.tileset = tileset;
	result.width = width;
	result.height = height;

	// generate floors
	var roomWidth = Utilities.randRangeInt(3,10);
	var roomHeight = Utilities.randRangeInt(3,10);
	var room = Room.createRoom( {x: Utilities.randRangeInt( 0, width-roomWidth), y: Utilities.randRangeInt( 0, height-roomHeight )}
							   , roomWidth
							   , roomHeight
							   , Utilities.randRangeInt( 1, 4 ) // number of connectors
							   , result
							  );
							  
	for( var roomCount = 0; roomCount < 5; roomCount++ ) {
		this.addRoom( room, result );
		for( var connectorIndex = 0; connectorIndex < room.connectors.length; ++connectorIndex ) {
			halfRoomWidth = Utilities.randRangeInt(2,5);
			halfRoomHeight = Utilities.randRangeInt(2,5);
			var connector = room.connectors[connectorIndex];
			var startPoint = null;
			switch( connector.orientation ) {
				case Orientation.North: {
					var startPoint = { x: connector.position.x - halfRoomWidth, y: connector.position.y - (halfRoomHeight*2) - 1 };
				}
				break;
				case Orientation.South: {
					var startPoint = { x: connector.position.x - halfRoomHeight, y: connector.position.y+1 };
				}
				break;
				case Orientation.East: {
					var startPoint = { x: connector.position.x+1, y: connector.position.y-halfRoomHeight };
				}
				break;
				case Orientation.West: {
					var startPoint = { x: connector.position.x-(halfRoomWidth*2)-1, y: connector.position.y-halfRoomHeight };
				}
				break;
			}

			if( startPoint != null ) {
				room = Room.createRoom( startPoint, halfRoomWidth*2, halfRoomHeight*2, Utilities.randRangeInt( 0, 2 ), result );
				this.addRoom( room, result );
			}
		}
	}
	
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
			var nextTile = { x: connector.position.x + connector.orientation.pos.x, y: connector.position.y+connector.orientation.pos.y };
			nextTile.index = nextTile.y*level.width+nextTile.x;
			level.tiles[nextTile.index] = { type: Level.Types.Floor, image: level.tileset.floors[0], objects: [] };
		}
	}
}

var generator = new Generator();
