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

Utilities.PositionToIndex = function( x, y, width ) {
	return y*width+x;
}