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
	var room = Room.createRoom( {x: Math.floor(result.width/2-roomWidth/2), y: Math.floor(result.height/2-roomHeight/2)}
								, null
						   		, roomWidth
						   		, roomHeight
						   		, Utilities.randRangeInt( 1, 4 ) // number of connectors
						   		, result
						  	);

	this.addRoom( room, result );
	this.generateNeighbors( room, result );						  

	return result;
}

Generator.prototype.generateNeighbors = function( room, level ) {
	for( var connectorIndex = 0; connectorIndex < room.connectors.length; ++connectorIndex ) {
		halfRoomWidth = Utilities.randRangeInt(2,5);
		halfRoomHeight = Utilities.randRangeInt(2,5);
		var connector = room.connectors[connectorIndex];
		var startPoint = null;
		switch( connector.orientation ) {
			case Orientation.North: {
				var startPoint = { x: connector.position.x - halfRoomWidth, y: connector.position.y - (halfRoomHeight*2) };
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
				var startPoint = { x: connector.position.x-(halfRoomWidth*2), y: connector.position.y-halfRoomHeight };
			}
			break;
		}

		if( startPoint != null && this.sweepTest( startPoint, halfRoomWidth*2, halfRoomHeight*2, level ) ) {
			var nextRoom = Room.createRoom( startPoint, halfRoomWidth*2, halfRoomHeight*2, connector, Utilities.randRangeInt( 1, 2 ), level );
			this.addRoom( nextRoom, level );
			this.generateNeighbors( nextRoom, level );
		}
		else {
			/*
			level.tiles[connector.index] = { type: Level.Types.Floor, image: level.tileset.floors[1], objects: [] };
			var nextTile = (connector.position.y+connector.orientation.pos.y)*level.width+(connector.position.x+connector.orientation.pos.x);
			level.tiles[nextTile]= { type: Level.Types.Floor, image: level.tileset.floors[2], objects: [] };
			*/
			level.tiles[connector.index] = null;
		}
	}
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
			var nextTile = (connector.position.y+connector.orientation.pos.y)*level.width+(connector.position.x+connector.orientation.pos.x);
			//level.tiles[nextTile]= { type: Level.Types.Floor, image: level.tileset.floors[3], objects: [] };
		}
	}
}

Generator.prototype.sweepTest = function( startPoint, roomWidth, roomHeight, level ) {
	for( var y = 0; y < roomHeight; y++ ) {
		for( var x = 0; x < roomWidth; x++ ) {
			var pos = { x: x+startPoint.x, y: y+startPoint.y };	
			if( pos.x >= level.width || pos.x < 0 ) return false;
			if( pos.y >= level.height || pos.y < 0 ) return false;
			var index = pos.y*level.width+pos.x;
			if( level.tiles[index] != undefined && level.tiles[index] != null )
			   return false;	
		}
	}
	return true;
}

var generator = new Generator();
