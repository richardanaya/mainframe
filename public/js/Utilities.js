var Orientation = {
	North: { x: 0, y: -1 },
	South: { x: 0, y: 1 },
	East: { x: 1, y: 0 },
	West: { x:-1, y: 0 },
	Center: { x:0, y: 0}
}

var Utilities = function() {
}

Utilities.randRange = function( min, max ) {
	return Math.random() * (max-min) + min;
}

Utilities.randRangeInt = function( min, max ) {
	return Math.round( Utilities.randRange(min,max) );
}

Utilities.createImage = function( url ) {
	var result = new Image();
	result.src = url;
	return result;
}

Utilities.positionToIndex = function( x, y, width ) {
	return y*width+x;
}

Utilities.getDirection = function( from, to ) {
	if( from.x == to.x ) {
		if( from.y > to.y ) {
			return Orientation.South;
		}
		else {
			return Orientation.North;
		}
	}
	else if( from.y == to.y ) {
		if( from.x > to.x ) 
			return Orientation.East;
		else 
			return Orientation.West;
	}

	return Orientation.Center;
}

Utilities.isStraight = function( from, to ) {
	if( from.x == to.x || from.y == to.y ) return true;
	return false;
}