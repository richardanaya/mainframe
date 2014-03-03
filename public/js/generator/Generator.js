var Generator = function() {
}

Generator.prototype.generateLevel = function( width, height ) {
	var level = new Level();
	level.width = width;
	level.height = height;
	level.center = { x: Math.floor( width/2), y: Math.floor( height/2 ) };
	level.tileset = Tileset.createOfficeTileset();
	
	var halfWidth = Utilities.randRangeInt( 2, 5 );
	var halfHeight = Utilities.randRangeInt( 2, 5 );
	this.createRoom( level.center.x-halfWidth, level.center.y-halfHeight, halfWidth, halfHeight, level );

	this.postProcess( level );

	return level;
}

Generator.prototype.postProcess = function( level ) {
	this.buildWalls( level );
	this.setupContextualTiles( level );
	this.cleanupTJoins( level );
	level.tileset.doPropPass( level );
}

Generator.prototype.tryCreateRoom = function( connector, level ) {
	var halfWidth = Utilities.randRangeInt( 2, 5 );
	var halfHeight = Utilities.randRangeInt( 2 ,5 );

	switch( connector.orientation ) {
		case Orientation.North: 	return this.createRoom( connector.doorPos.x - halfWidth, 	connector.doorPos.y - halfHeight*2, halfWidth, halfHeight, level );
		case Orientation.East: 		return this.createRoom( connector.doorPos.x + 1, 			connector.doorPos.y - halfHeight, 	halfWidth, halfHeight, level );
		case Orientation.South: 	return this.createRoom( connector.doorPos.x - halfWidth, 	connector.doorPos.y + 1, 			halfWidth, halfHeight, level );
		case Orientation.West: 		return this.createRoom( connector.doorPos.x - halfWidth*2, 	connector.doorPos.y - halfHeight, 	halfWidth, halfHeight, level );
	}
}

Generator.prototype.createRoom = function( left, top, halfWidth, halfHeight, level, numconnectors ) {
	if( numconnectors == undefined ) numconnectors = Utilities.randRangeInt( 2,4 );

	var room = { 
		halfWidth: halfWidth,
		halfHeight: halfHeight,
		width: halfWidth*2,
		height: halfHeight*2,
		x: left,
		y: top,
		center: { x: left+halfWidth, y: top+halfHeight },
	};

	var result = false;
	if( this.canPlaceRoom( room, level ) )
	{
		for( var y = 0; y < room.height; y++ ) {
			for( var x = 0; x < room.width; x++ ) {
				level.tiles[ Utilities.positionToIndex(room.x+x,room.y+y,level.width) ] = this.createTile( Level.Types.Floor, level.tileset.floors[0], x+room.x, y+room.y, room );
			}
		}

		for( var connectorIndex = 0; connectorIndex < numconnectors; connectorIndex++ ) {
			var connector = null;
			var randomWidth = Utilities.randRangeInt( 1, room.width-2 );
			var randomHeight = Utilities.randRangeInt( 1, room.height-2 );
			switch( Utilities.randRangeInt( 0, 4 ) ) {
				default:
				case 0: connector = { x:randomWidth, y:0, orientation: Orientation.North }; break;
				case 1: connector = { x:room.width-1, y:randomHeight, orientation: Orientation.East }; break;
				case 2: connector = { x:randomWidth, y:room.height-1, orientation: Orientation.South }; break;
				case 3: connector = { x:0,y:randomHeight, orientation: Orientation.West }; break;
			}

			if( connector != null ) {
				connector.x += room.x;
				connector.y += room.y;
				connector.index = Utilities.positionToIndex( connector.x, connector.y, level.width );
				connector.doorPos = { x: connector.x + connector.orientation.x, y: connector.y + connector.orientation.y };
				connector.doorPos.index = Utilities.positionToIndex( connector.doorPos.x, connector.doorPos.y, level.width );
				connector.welcomeMat = { x: connector.doorPos.x + connector.orientation.x, y: connector.doorPos.y + connector.orientation.y };
				connector.welcomeMat.index = Utilities.positionToIndex( connector.welcomeMat.x, connector.welcomeMat.y, level.width );

				if( this.tryCreateRoom( connector, level ) )
				{
					level.tiles[ connector.doorPos.index ] = this.createTile( Level.Types.Door, level.tileset.floors[1], connector.doorPos.x, connector.doorPos.y );
					level.tiles[ connector.doorPos.index ].orientation = connector.orientation;
					level.tiles[ connector.doorPos.index ].noblock = true;
					level.tiles[ connector.index ].noblock = true;
					level.tiles[ connector.welcomeMat.index ].noblock = true;	
				}
			}
		}
		level.rooms.push( room );
		result = true;
	}

	return result;
}

Generator.prototype.canPlaceRoom = function( room, level ) {
	for( var y = room.y; y < room.height+room.y; y++ ) {
		for( var x = room.x; x < room.width+room.x; x++ ) {
			if( y >= level.height || y < 0 ) return false;
			if( x >= level.width || x < 0 ) return false;

			var index = Utilities.positionToIndex(x,y,level.width);
			if( level.tiles[ index ] != null && level.tiles[index] != undefined ) {
				return false;
			}
		}
	}

	return true;
}

Generator.prototype.buildWalls = function( level ) {
	for( var y = 0; y < level.height; y++ ) {
		for( var x = 0; x < level.width; x++ ) {
			var tile = level.getTileAt( x, y );
			if( tile == null ) {
				var isWall = false;
				var floorNeighbors = level.getNeighborsByType(x,y,Level.Types.Floor);
				isWall = floorNeighbors.length > 0;
				if( isWall ) {
					level.tiles[ Utilities.positionToIndex(x,y,level.width) ] = this.createTile( Level.Types.Wall, level.tileset.props[0], x, y );
				}
			}
			else if( y == 0 || y == level.height-1 || x == 0 || x == level.width-1 ) {
				tile.type = Level.Types.Wall;
			}
		}
	}
}

Generator.prototype.setupContextualTiles = function( level ) {
	for( var y = 0; y < level.height; y++ ) {
		for( var x = 0; x < level.width; x++ ) {
			var tile = level.getTileAt(x,y);
			if( tile != null ) {
				switch( tile.type ) {
					case Level.Types.Wall: this.processWall( tile,x,y,level ); break;
					case Level.Types.Door: this.processDoor( tile,x,y,level ); break;
					case Level.Types.Floor: this.processFloor( tile,x,y,level ); break;
				}
			}
		}
	}	
}

Generator.prototype.processWall = function( tile, x, y, level ) {
	var adjWalls = level.getOrdinalNeighborsByType( x, y, Level.Types.Wall );
	if( adjWalls.length == 0 ) {
		tile.wallType = Level.WallTypes.Pillar;
		tile.image = level.tileset.props[2];
	}
	else if( adjWalls.length == 1 ) {
		tile.wallType = Level.WallTypes.EndCap;
		var adjWall = adjWalls[0];
		var dir = Utilities.getDirection( tile, adjWall );
		switch( dir ) {
			case Orientation.North: 	tile.image = level.tileset.walls.endcaps.north[0]; break;
			case Orientation.South: 	tile.image = level.tileset.walls.endcaps.south[0]; break;
			case Orientation.East: 		tile.image = level.tileset.walls.endcaps.east[0]; break;
			case Orientation.West: 		tile.image = level.tileset.walls.endcaps.west[0]; break;
		}
	}
	else if( adjWalls.length == 2 ) {
		if( Utilities.isHorizontal( adjWalls[0], adjWalls[1] ) ) {
			tile.wallType = Level.WallTypes.Straight;
			tile.image = level.tileset.walls.straights.horizontal[0];
		}
		else if( Utilities.isVertical( adjWalls[0], adjWalls[1] ) ) {
			tile.wallType = Level.WallTypes.Straight;
			tile.image = level.tileset.walls.straights.vertical[0];
		}
		else {
			tile.wallType = Level.WallTypes.Corner;
			switch( Utilities.getCornerType( tile, adjWalls[0], adjWalls[1] ) ) {
				case 'NorthEast': 		tile.image = level.tileset.walls.corners.northeast[0]; break;
				case 'NorthWest': 		tile.image = level.tileset.walls.corners.northwest[0]; break;
				case 'SouthEast': 		tile.image = level.tileset.walls.corners.southeast[0]; break;
				case 'SouthWest': 		tile.image = level.tileset.walls.corners.southwest[0]; break;
			}
		}
	}
	else if( adjWalls.length == 3 ) {
		tile.wallType = Level.WallTypes.TJoin;
		tile.orientation = Utilities.getTJoinType( tile, adjWalls[0], adjWalls[1], adjWalls[2] )
		switch( tile.orientation ) {
			case Orientation.North: 	tile.image = level.tileset.walls.tjoins.north[0]; break;
			case Orientation.South: 	tile.image = level.tileset.walls.tjoins.south[0]; break;
			case Orientation.East: 		tile.image = level.tileset.walls.tjoins.east[0]; break;
			case Orientation.West: 		tile.image = level.tileset.walls.tjoins.west[0]; break;
			}
		
		level.tjoins.push( tile );
	}
	else {
		tile.wallType = Level.WallTypes.Cross;
		tile.image = level.tileset.walls.crosses[0];
	}
}

Generator.prototype.processDoor = function( tile, x, y, level ) {
	if( tile.orientation.x > 0 || tile.orientation.x < 0 ) {
		tile.image = level.tileset.doors.vertical[0];	
	}
	else {
		tile.image = level.tileset.doors.horizontal[0];
	}
}

Generator.prototype.processFloor = function( tile, x, y, level ) {
	var walls = level.getOrdinalNeighborsByType( x,y, Level.Types.Wall );
	switch( walls.length ) {
		default:
		case 0: return;
		case 1: {
			var wall = walls[0]
			if( Utilities.isHorizontal( tile, wall ) ) {
				if( tile.x > wall.x ) {
					tile.image = level.tileset.edging.west[0];
				}
				else {
					tile.image = level.tileset.edging.east[0];
				}
			}
			else if( tile.y > wall.y ) {
				tile.image = level.tileset.edging.north[0];
			}
			else if( tile.y < wall.y ) {
				tile.image = level.tileset.edging.south[0];
			}
		}
		break;
		case 2: {
			var wall1 = walls[0];
			var wall2 = walls[1];
			if( tile.x < wall1.x || tile.x < wall2.x ) {
				//east
				if( tile.y < wall1.y || tile.y < wall2.y ) {
					tile.image = level.tileset.edging.southeast[0];
				}
				else {
					tile.image = level.tileset.edging.northeast[0];
				}
			}
			else if( tile.x > wall1.x || tile.x > wall2.x ) {
				if( tile.y < wall1.y || tile.y < wall2.y ) {
					tile.image = level.tileset.edging.southwest[0];
				}
				else {
					tile.image = level.tileset.edging.northwest[0];
				}
			}
		}
		break;
	}
}

Generator.prototype.cleanupTJoins = function( level ) {
	for( var i = 0; i < level.tjoins.length; i++ ) {
		var tile = level.tjoins[i];
		var connectedTJoins = level.getOrdinalNeighborsByWallType( tile.x, tile.y, Level.WallTypes.TJoin );
		if( connectedTJoins.length > 2 ) {
			for( var coni = 0; coni < connectedTJoins.length; coni++ ) {
				var tjoin = connectedTJoins[coni];
				if( tile.orientation == Utilities.invertDirection( tjoin.orientation ) ) {
					if( Utilities.isVertical( tile, tjoin ) && tile.orientation.isVertical ) {
						//var img = level.tileset.props[i%level.tileset.props.length];
						var img = level.tileset.walls.straights.horizontal[0];
						tile.image = img;
						tile.tileType = Level.WallTypes.Straight;
						tjoin.image = img;
						tjoin.tileType = Level.WallTypes.Straight;
						break;
					}
					else if( Utilities.isHorizontal( tile, tjoin ) && !tile.orientation.isVertical ) {
						//var img = level.tileset.props[i%level.tileset.props.length];
						var img = level.tileset.walls.straights.vertical[0];
						tile.image = img;
						tile.tileType = Level.WallTypes.Straight;
						tjoin.image = img;
						tjoin.tileType = Level.WallTypes.Straight;
						break;
					}
				}
			}
		}
	}
}

Generator.prototype.createTile = function( type, img, x, y, room ) {
	return { 
		type: type
		, image: img
		, objects: []
		, x: x
		, y: y
		, noblock: false
		, explored: false
		, room: room 
		, brightness: 0
	};
}