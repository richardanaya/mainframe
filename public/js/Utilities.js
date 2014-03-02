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

Utilities.getInverseDirection = function( from, to ) {
	switch( this.getDirection( from, to ) ) {
		case Orientation.North: return Orientation.South;
		case Orientation.South: return Orientation.North;
		case Orientation.East: return Orientation.West;
		case Orientation.West: return Orientation.East;
	}

	return Orientation.Center;
}

Utilities.isHorizontal = function( from, to ) {
	return ( from.x != to.x && from.y == to.y );
}

Utilities.isVertical = function( from, to ) {
	return ( from.x == to.x && from.y != to.y );
}

Utilities.isStraight = function( from, to ) {
	return this.isHorizontal( from, to ) || this.isVertical( from, to );
}

Utilities.getCornerType = function( center, first, second ) {
	if( center.y < first.y || center.y < second.y ) {
		//north!
		if( center.x < first.x || center.x < second.x ) {
			return "NorthWest";
		}
		else {
			return "NorthEast";
		}
	}
	else {
		//south!
		if( center.x < first.x || center.x < second.x ) {
			return "SouthEast";
		}
		else {
			return "SouthWest";
		}
	}

	return "Unknown";
}



Utilities.getTJoinType = function( center, first, second, third ) {
	if( this.isStraight( first, second ) ) {
		return this.getDirection( center, third );
	}
	else if( this.isStraight( first, third ) ) {
		return this.getDirection( center, second );
	}
	else if( this.isStraight( second, third ) ) {
		return this.getDirection( center, first );
	}
}