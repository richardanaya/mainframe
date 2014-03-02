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
	var room = this.createRoom( level.center.x-halfWidth, level.center.y-halfHeight, halfWidth, halfHeight, level, Utilities.randRangeInt( 1, 4 ) );
	return level;
}

Generator.prototype.createRoom = function( left, top, halfWidth, halfHeight, level, numconnectors ) {
	var room = { 
		halfWidth: halfWidth,
		halfHeight: halfHeight,
		width: halfWidth*2,
		height: halfHeight*2,
		x: left,
		y: top,
		center: { x: left+halfWidth, y: top+halfHeight }
	};

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
				level.tiles[ connector.doorPos.index ] = this.createTile( Level.Types.Floor, level.tileset.floors[1] );

				// create adjoining room
				
			}
		}
	}
}

Generator.prototype.canPlaceRoom = function( room, level ) {
	for( var y = room.y; y < room.height+room.y; y++ ) {
		for( var x = room.x; x < room.width+room.x; x++ ) {
			if( y >= level.height || y < 0 ) return false;
			if( x >= level.width || x < 0 ) return false;

			var index = Utilities.PositionToIndex(x,y,level.width);
			if( level.tiles[ index ] != null && levels.tiles[index] != undefined ) {
				return false;
			}
		}
	}

	return true;
}

Generator.prototype.createTile = function( type, img ) {
	return { type: type, image: img, objects: [] };
}