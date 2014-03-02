var Orientation = {
	North: { pos: { x:0, y:-1 } },
	East: { pos: { x:1, y:0 } },
	South: { pos: { x:0, y:1 } },
	West: { pos: { x:-1, y:0 } }
};

var Connector = function( pos, orient ) {
	this.position = pos;
	this.orientation = orient;
	this.index = 0;
}

var Room = function() {
	this.upperLeft = { x:0, y:0 };
	this.width = 0;
	this.height = 0;
	this.tiles = [];
	this.connectors = [];
}

Room.createRoom = function( startPos, width, height, from, numConnectors, level ) {
	var result = new Room();
	result.width = width;
	result.height = height;
	for( var y = 0; y < height; y++ ) {
		for( var x = 0; x < width; x++ ) {
			var index = (y+startPos.y)*level.width+(x+startPos.x);
			result.tiles.push( { index: index, type: Level.Types.Floor } );
		}
	}

	for( var roomIndex = 0; roomIndex < numConnectors; ++roomIndex ) {
		var randWidth = Utilities.randRangeInt(1,result.width-2); 
		var randHeight = Utilities.randRangeInt(1,result.height-2);
		switch( Utilities.randRangeInt(0,4) ) {
			default:
			case 0: result.connectors[roomIndex] = new Connector( {x:randWidth+startPos.x,y:startPos.y}, Orientation.North ); break;
			case 1: result.connectors[roomIndex] = new Connector( {x:startPos.x+width-1,y:startPos.y+randHeight}, Orientation.East ); break;
			case 2: result.connectors[roomIndex] = new Connector( {x:startPos.x+randWidth,y:startPos.y+result.height-1}, Orientation.South ); break;
			case 3: result.connectors[roomIndex] = new Connector( {x:startPos.x,y:startPos.y+randHeight}, Orientation.West ); break;
		}

		result.connectors[roomIndex].position.x += result.connectors[roomIndex].orientation.pos.x;
		result.connectors[roomIndex].position.y += result.connectors[roomIndex].orientation.pos.y;
		result.connectors[roomIndex].index = (result.connectors[roomIndex].position.y)*level.width+(result.connectors[roomIndex].position.x);
	}

	return result;
}
