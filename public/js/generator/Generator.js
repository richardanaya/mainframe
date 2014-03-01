var Generator = function(){
}

Generator.prototype.randRange = function( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

Generator.prototype.generateRoom = function( minx, maxx, miny, maxy ) {
	var room = new Room();
	switch( this.randRange( 0, 4 ) {
		default:
		case 0: { // box room
			room = this.generateBoxRoom( this.randRange( minx, maxx ), this.randRange( miny, maxy ) );
		}
		break;
		case 1: { // L shaped room
			room = this.generateLRoom( this.randRange( minx, maxx ), this.randRange( miny, maxy ) );
		}
		break;
		case 2: { // T shaped room
			room = this.generateTRoom( this.randRange( minx, maxx ), this.randRange( miny, maxy ) );
		}
		break;
		case 3: { // + Shaped room
			room = this.generateCrossRoom( this.randRange( minx, maxx ), this.randRange( miny, maxy ) );
		}
		break;
	}
}


