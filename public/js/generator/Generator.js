var Generator = function() {
}



Generator.prototype.generateLevel = function( width, height ) {
	var level = new Level();
	level.width = width;
	level.height = height;
	level.center = { x: Math.floor( width/2), y: Math.floor( height/2 ) };
	level.tileset = Tileset.createOfficeTileset();

	var room = this.createRoom( level.center, level, Utilities.randRangeInt( 1, 4 ) );
	return level;
}

Generator.prototype.createRoom = function( center, level, numconnectors ) {
	var room = { 
		halfWidth: Utilities.randRangeInt( 2, 5 ),
		halfHeight: Utilities.randRangeInt( 2, 5 ),
	};

	room.x = center.x - room.halfWidth;
	room.y = center.y - room.halfHeight;
	room.width = room.halfWidth*2;
	room.height = room.halfHeight*2;

	if( this.canPlaceRoom( room, level ) )
	{
		for( var y = 0; y < room.halfHeight*2; y++ ) {
			for( x = 0; x < room.halfWidth*2; x++ ) {
				level.tiles[ Utilities.PositionToIndex(x,y,level.width) ] = this.createTile( Level.Types.Floor, level.tileset.floors[0] );
			}
		}

		/*
		for( var connectorIndex = 0; connectorIndex < numconnectors; connectorIndex++ ) {
			var connector = {};
			switch( Utilities.randRangeInt( 0, 4 ) ) {
				case 0: connector.x = Utilities.randRangeInt
			}
		}
		*/
	}
}

Generator.prototype.canPlaceRoom = function( room, level ) {
	for( var y = room.y; y < room.height; y++ ) {
		for( var x = room.x; x < room.width; x++ ) {
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