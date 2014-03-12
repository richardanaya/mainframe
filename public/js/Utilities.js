var Orientation = {
	North: { x: 0, y: -1, isVertical: true },
	South: { x: 0, y: 1, isVertical: true },
	East: { x: 1, y: 0, isVertical: false },
	West: { x:-1, y: 0, isVertical: false },
	Center: { x:0, y: 0, isVertical: false }
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

Utilities.invertDirection = function( dir ) {
	switch( dir ) {
		case Orientation.North: return Orientation.South;
		case Orientation.South: return Orientation.North;
		case Orientation.East: return Orientation.West;
		case Orientation.West: return Orientation.East;
	}

	return Orientation.Center;
}

Utilities.getInverseDirection = function( from, to ) {
	return this.invertDirection( this.getDirection( from, to ) );
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

Utilities.inARow = function( tile, list ) {
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

Utilities.isPointInRectangle = function(x,y,rx,ry,w,h){
    return (x>=rx && x< rx+w && y>= ry && y <ry+h);
}

Utilities.distanceSqr = function( from, to ) {
	var diff = { x: to.x-from.x, y: to.y-from.y };
	return diff.x*diff.x+diff.y*diff.y;
}

// vector utils
Utilities.isPointOnLine = function( lineSegment, test ) {
	return (test.x <= Math.max(lineSegment[0].x, lineSegment[1].x) && test.x >= Math.min(lineSegment[0].x, lineSegment[1].x) &&
        	test.y <= Math.max(lineSegment[0].y, lineSegment[1].y) && test.y >= Math.min(lineSegment[0].y, lineSegment[1].y));
}

Utilities.getRelativeOrientation = function( p, q, r ) {
    // see http://www.dcs.gla.ac.uk/~pat/52233/slides/Geometry1x1.pdf
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
 
    if (val == 0) return 0;  // colinear
 
    return (val > 0) ? 1: 2; // clock or counterclock wise
}

Utilities.doLineSegmentsIntersect = function( l1, l2 ) {
	if( l1 == null || l1 == undefined || l2 == null || l2 == undefined ) debugger;
	return Utilities.doLineSegmentIntersectPoints( l1[0], l1[1], l2[0], l2[1] );
}

Utilities.doLineSegmentIntersectPoints = function( p1, p2, q1, q2 ) {
	if( p1 == null || p1 == undefined || p2 == null || p2 == undefined || q1 == null || q1 == undefined || q2 == null || q2 == undefined ) debugger;

    var o1 = Utilities.getRelativeOrientation(p1, q1, p2);
    var o2 = Utilities.getRelativeOrientation(p1, q1, q2);
    var o3 = Utilities.getRelativeOrientation(p2, q2, p1);
    var o4 = Utilities.getRelativeOrientation(p2, q2, q1);
 
    if (o1 != o2 && o3 != o4)
        return true;
 
    // Special Cases
    if (o1 == 0 && Utilities.isPointOnLine( [p1,q1], p2)) return true;
    if (o2 == 0 && Utilities.isPointOnLine( [p1,q1], q2)) return true;
    if (o3 == 0 && Utilities.isPointOnLine( [p2,q2], p1)) return true;
    if (o4 == 0 && Utilities.isPointOnLine( [p2,q2], q1)) return true;
 
    return false; // Doesn't fall in any of the above cases
}

Utilities.makeLineSegment = function( p1, p2 ) {
	return [p1,p2];
}

Utilities.lerp = function( p1, p2, t ) {
	return p1 + t * ( p2 - p1 );
}

Utilities.shuffleArray = function( array ) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}