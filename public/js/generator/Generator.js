var Generator = function() {
}

Generator.prototype.generateLevel = function(width,height,tileset) {
	var result = new Level();
	result.tileset = tileset;
	result.width = width;
	result.height = height;

	this.generateLayout( result );

	return result;
}

Generator.prototype.generateLayout = function( level ) {
	this.addRoom( level );
}

Generator.prototype.addRoom = function( level ) {
	var width = 5;
	var height = 5;
	for( var y = 0; y < height; y++ ) {
		for( var x = 0; x < width; x++ ) {
			level.tiles[y*level.width+x] = { type: Level.Types.Floor, image: level.tileset.getRandomFloor(), objects:[] };
		}
	}
}

var generator = new Generator();
