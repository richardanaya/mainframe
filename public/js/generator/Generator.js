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
				level.tiles[ Utilities.PositionToIndex(room.x+x,room.y+y,level.width) ] = this.createTile( Level.Types.Floor, level.tileset.floors[0] );
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
				connector.doorPos.index = Utilities.PositionToIndex( connector.doorPos.x, connector.doorPos.y, level.width );

				if( this.tryCreateRoom( connector, level ) )
				{
					level.tiles[ connector.doorPos.index ] = this.createTile( Level.Types.Floor, level.tileset.floors[1] );
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

			var index = Utilities.PositionToIndex(x,y,level.width);
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
					level.tiles[ Utilities.PositionToIndex(x,y,level.width) ] = this.createTile( Level.Types.Wall, level.tileset.props[0] );
				}
			}
		}
	}
}

Generator.prototype.createTile = function( type, img ) {
	return { type: type, image: img, objects: [] };
}