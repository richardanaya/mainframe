var Generator = function() {
}

Generator.prototype.generateLevel = function( width, height ) {
	var level = new Level();
	level.width = width;
	level.height = height;
	level.center = { x: Math.floor( width/2), y: Math.floor( height/2 ) };
	level.tileset = Tileset.createOfficeTileset();

	var halfWidth = Utilities.randRangeInt( 2, 5 );
	var halfHeight = Utilities.randRangeInt( 2, 5 );
	this.createRoom( level.center.x-halfWidth, level.center.y-halfHeight, halfWidth, halfHeight, level );

	this.buildWalls( level );
	this.setupContextualTiles( level );

	return level;
}

Generator.prototype.tryCreateRoom = function( connector, level ) {
	var halfWidth = Utilities.randRangeInt( 2, 5 );
	var halfHeight = Utilities.randRangeInt( 2 ,5 );

	switch( connector.orientation ) {
		case Orientation.North: 	return this.createRoom( connector.doorPos.x - halfWidth, 	connector.doorPos.y - halfHeight*2, halfWidth, halfHeight, level );
		case Orientation.East: 		return this.createRoom( connector.doorPos.x + 1, 			connector.doorPos.y - halfHeight, 	halfWidth, halfHeight, level );
		case Orientation.South: 	return this.createRoom( connector.doorPos.x - halfWidth, 	connector.doorPos.y + 1, 			halfWidth, halfHeight, level );
		case Orientation.West: 		return this.createRoom( connector.doorPos.x - halfWidth*2, 	connector.doorPos.y - halfHeight, 	halfWidth, halfHeight, level );
	}
}

Generator.prototype.createRoom = function( left, top, halfWidth, halfHeight, level, numconnectors ) {
	if( numconnectors == undefined ) numconnectors = Utilities.randRangeInt( 1,4 );

	var room = { 
		halfWidth: halfWidth,
		halfHeight: halfHeight,
		width: halfWidth*2,
		height: halfHeight*2,
		x: left,
		y: top,
		center: { x: left+halfWidth, y: top+halfHeight }
	};

	var result = false;
	if( this.canPlaceRoom( room, level ) )
	{
		for( var y = 0; y < room.height; y++ ) {
			for( var x = 0; x < room.width; x++ ) {
				level.tiles[ Utilities.positionToIndex(room.x+x,room.y+y,level.width) ] = this.createTile( Level.Types.Floor, level.tileset.floors[0], x, y );
			}
		}

		for( var connectorIndex = 0; connectorIndex < numconnectors; connectorIndex++ ) {
			var connector = null;
			var randomWidth = Utilities.randRangeInt( 1, room.width-2 );
			var randomHeight = Utilities.randRangeInt( 1, room.height-2 );
			switch( Utilities.randRangeInt( 0, 4 ) ) {
				default:
				case 0: connector = { x:randomWidth, y:0, orientation: Orientation.North }; break;
				case 1: connector = { x:room.width-1, y:randomHeight, orientation: Orientation.East }; break;
				case 2: connector = { x:randomWidth, y:room.height-1, orientation: Orientation.South }; break;
				case 3: connector = { x:0,y:randomHeight, orientation: Orientation.West }; break;
			}

			if( connector != null ) {
				connector.x += room.x;
				connector.y += room.y;
				connector.doorPos = { x: connector.x + connector.orientation.x, y: connector.y + connector.orientation.y };
				connector.doorPos.index = Utilities.positionToIndex( connector.doorPos.x, connector.doorPos.y, level.width );

				if( this.tryCreateRoom( connector, level ) )
				{
					level.tiles[ connector.doorPos.index ] = this.createTile( Level.Types.Door, level.tileset.floors[1], connector.doorPos.x, connector.doorPos.y );
				}
			}
		}
		result = true;
	}

	return result;
}

Generator.prototype.canPlaceRoom = function( room, level ) {
	for( var y = room.y; y < room.height+room.y; y++ ) {
		for( var x = room.x; x < room.width+room.x; x++ ) {
			if( y >= level.height || y < 0 ) return false;
			if( x >= level.width || x < 0 ) return false;

			var index = Utilities.positionToIndex(x,y,level.width);
			if( level.tiles[ index ] != null && level.tiles[index] != undefined ) {
				return false;
			}
		}
	}

	return true;
}

Generator.prototype.buildWalls = function( level ) {
	for( var y = 0; y < level.height; y++ ) {
		for( var x = 0; x < level.width; x++ ) {
			if( level.getTileAt( x, y ) == null ) {
				var isWall = false;
				var floorNeighbors = level.getNeighborsByType(x,y,Level.Types.Floor);
				isWall = floorNeighbors.length > 0;
				if( isWall ) {
					level.tiles[ Utilities.positionToIndex(x,y,level.width) ] = this.createTile( Level.Types.Wall, level.tileset.props[0], x, y );
				}
			}
		}
	}
}

Generator.prototype.setupContextualTiles = function( level ) {
	for( var y = 0; y < level.height; y++ ) {
		for( var x = 0; x < level.width; x++ ) {
			var tile = level.getTileAt(x,y);
			if( tile != null ) {
				switch( tile.type ) {
					case Level.Types.Wall: this.processWall( tile,x,y,level ); break;
					case Level.Types.Door: this.processDoor( tile,x,y,level ); break;
				}
			}
		}
	}	
}

Generator.prototype.processWall = function( tile, x, y, level ) {
	var adjWalls = level.getCardinalNeighborsByType( x, y, Level.Types.Wall );
	if( adjWalls.length == 0 ) {
		// pillars never happen
		tile.image = level.tileset.props[2];
	}
	else if( adjWalls.length == 1 ) {
		// end caps
		var adjWall = adjWalls[0];
		var dir = Utilities.getDirection( { x:tile.x, y:tile.y }, { x:adjWall.x, y:adjWall.y } );
		switch( dir ) {
			case Orientation.North: 	tile.image = level.tileset.walls.endcaps.north[0]; break;
			case Orientation.South: 	tile.image = level.tileset.walls.endcaps.south[0]; break;
			case Orientation.East: 		tile.image = level.tileset.walls.endcaps.east[0]; break;
			case Orientation.West: 		tile.image = level.tileset.walls.endcaps.west[0]; break;
		}
	}
	else if( adjWalls.length == 2 ) {
		// corner or straight
		tile.image = level.tileset.walls.straights.vertical[0];
	}
	else if( adjWalls.length == 3 ) {
		// tjoin
		tile.image = level.tileset.walls.tjoins.north[0];
	}
	else {
		// cross
		tile.image = level.tileset.walls.crosses[0];
	}
}

Generator.prototype.processDoor = function( tile, x, y, level ) {
	tile.image = level.tileset.doors.horizontal[0];
}

Generator.prototype.createTile = function( type, img, x, y ) {
	return { type: type, image: img, objects: [], x: x, y: y };
}