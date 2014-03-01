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

Room.createRoom = function( startPos, width, height, numConnectors, level ) {
	var result = new Room();
	result.width = width;
	result.height = height;
	for( var y = 0; y < height; y++ ) {
		for( var x = 0; x < width; x++ ) {
			var index = (y+startPos.y)*level.width+(x+startPos.x);
			if( y == 0 || y == height-1 || x == 0 || x == width-1 ) {
				result.tiles.push( { index: index, type: Level.Types.Wall  } );
			}
			else {
				result.tiles.push( { index: index, type: Level.Types.Floor } );
			}
		}
	}

	var perimeter = (width-1)*2+(height-1)*2;
	for( var c = 0; c < numConnectors; ++c ) {
		var selected = Utilities.randRangeInt( 0, perimeter );
		if( selected < width ) { //top
			result.connectors[c] = new Connector( { x: selected+startPos.x, y:startPos.y }, Orientation.North );
		}
		else if( selected < width+height ) { //right side
			result.connectors[c] = new Connector( { x: startPos.x+width-1, y:startPos.y+selected-width }, Orientation.East );
		}
		else if( selected < width*2+height ) { //bottom
			result.connectors[c] = new Connector( { x: (selected-height)%width+startPos.x, y: startPos.y+height-1 }, Orientation.South );
		}
		else { //left side
			result.connectors[c] = new Connector( { x: startPos.x, y: startPos.y+selected%width }, Orientation.West );
		}

		result.connectors[c].index = (result.connectors[c].position.y)*level.width+(result.connectors[c].position.x)
	}	

	return result;
}
