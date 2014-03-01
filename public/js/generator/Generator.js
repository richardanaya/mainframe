var Generator = function() {
}

Generator.prototype.generateLevel = function(width,height,tileset) {
	var result = new Level();
	result.tileset = tileset;
	result.width = width;
	result.height = height;

	for( var y = 0; y < height; y++ ) {
		for( var x = 0; x < width; x++ ) {
			result.tiles[y*result.width+x] = { type: Level.Types.Floor, image: result.tileset.getRandomFloor(), objects:[] };
		}
	}

	return result;
}

Generator.prototype.generateLayout = function( level ) {
	this.addRoom( level );
}

Generator.prototype.addRoom = function( level ) {
	var width = Utilities.randRangeInt( 5, 10 );
	var height = Utilities.randRangeInt( 5, 10 );
	for( var y = 0; y < height; y++ ) {
		for( var x = 0; x < width; x++ ) {
		}
	}
}

var generator = new Generator();
