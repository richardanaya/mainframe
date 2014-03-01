var Generator = function() {
}

Generator.prototype.generateLevel = function(width,height,tileset) {
	var result = new Level();
	result.tileset = tileset;
	result.width = width;
	result.height = height;

	var room = {
		width: Utilities.randRangeInt( 4, 11 ),
		height: Utilities.randRangeInt( 4, 11 ),
		upperLeft: { x:10, y:10 }
	}

	this.addRoom( room, result );
	
	return result;
}

Generator.prototype.addRoom = function( room, level ) {
	for( var y = 0; y < room.height; y++ ) {
		for( var x = 0; x < room.width; x++ ) {
			var index = (y+room.upperLeft.y)*level.width+(x+room.upperLeft.x);
			if( y == 0 || y == room.height-1 || x == 0 || x == room.width-1 ) {
				level.tiles[index] = { type: Level.Types.Wall, image: level.tileset.walls.encaps.north[0], objects:[] };
			}
			else {
				level.tiles[index] = { type: Level.Types.Floor, image: level.tileset.getRandomFloor(), objects:[] };
			}
		}
	}
}

var generator = new Generator();
