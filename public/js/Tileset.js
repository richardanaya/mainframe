var Tileset = function() {
	this.floors = [];
	this.walls = {};
	this.doors = {};
	this.props = [];
}

Tileset.prototype.getRandomFloor = function() {
	
	return this.floors[ Utilities.randRangeInt( 0, this.floors.length-1 ) ];
}

// factory functions //////////////////////////////////////////////////////////
Tileset.createOfficeTileset = function() {
	var result = new Tileset();
	result.floors = [ 
		Utilities.createImage( 'images/tilesets/office/floors/floor01.png' ),
		Utilities.createImage( 'images/tilesets/office/floors/floor02.png' ),
		Utilities.createImage( 'images/tilesets/office/floors/floor03.png' ),
		Utilities.createImage( 'images/tilesets/office/floors/floor04.png' ),
		Utilities.createImage( 'images/tilesets/office/floors/floor_windowlight.png' )
	];

	result.edging = {
		north: 			[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_top.png' )], 
		northeast: 		[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_topright.png' )], 
		east: 			[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_right.png' )], 
		southeast: 		[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_bottomright.png' )], 
		south: 			[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_bottom.png' )], 
		southwest: 		[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_bottomleft.png' )], 
		west: 			[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_left.png' )], 
		northwest:	 	[Utilities.createImage( 'images/tilesets/office/floors/floor_shadow_topleft.png' )], 
	};

	result.walls = {
		pillars: [ Utilities.createImage('images/grass.png') ],
		crosses: [ Utilities.createImage('images/tilesets/office/walls/wall_cross.png') ],
		endcaps: {
			north: [Utilities.createImage('images/tilesets/office/walls/wall_cap_n.png')],
			east: [Utilities.createImage('images/tilesets/office/walls/wall_cap_e.png')],
			south: [Utilities.createImage('images/tilesets/office/walls/wall_cap_s.png')],
			west: [Utilities.createImage('images/tilesets/office/walls/wall_cap_w.png')]
		},
		corners: {
			northwest: [Utilities.createImage('images/tilesets/office/walls/wall_corner_nw.png')],
			northeast: [Utilities.createImage('images/tilesets/office/walls/wall_corner_ne.png')],
			southeast: [Utilities.createImage('images/tilesets/office/walls/wall_corner_se.png')],
			southwest: [Utilities.createImage('images/tilesets/office/walls/wall_corner_sw.png')]
		},
		straights: {
			vertical: [Utilities.createImage('images/tilesets/office/walls/wall_straight_ns.png')],
			horizontal: [
				Utilities.createImage('images/tilesets/office/walls/wall_straight_ew01.png'),
				Utilities.createImage('images/tilesets/office/walls/wall_straight_ew02.png')
			]
		},
		tjoins: {
			north: [Utilities.createImage('images/tilesets/office/walls/wall_tjoin_n.png')],
			east: [Utilities.createImage('images/tilesets/office/walls/wall_tjoin_e.png')],
			south: [Utilities.createImage('images/tilesets/office/walls/wall_tjoin_s.png')],
			west: [Utilities.createImage('images/tilesets/office/walls/wall_tjoin_w.png')]
		},
	};

	result.props = [
		Utilities.createImage('images/tilesets/office/props/prop01.png'),
		Utilities.createImage('images/tilesets/office/props/prop02.png'),
		Utilities.createImage('images/tilesets/office/props/prop03.png'),
		Utilities.createImage('images/tilesets/office/props/prop04.png'),
	];

	result.doors = {
		vertical: [Utilities.createImage('images/tilesets/office/doors/door_v.png')],
		horizontal: [Utilities.createImage('images/tilesets/office/doors/door_h.png')],
	};

	result.doPropPass = function( level ) {
		for( var roomIndex = 0; roomIndex < level.rooms.length; roomIndex++ ) {
			var room = level.rooms[roomIndex];
			var rand = Math.random();
			if( rand < 0.4 ) {
				// empty room
			}
			else if( rand < 0.65 && room.height > 4 ) {
				// server room
				for( var y = room.y+1; y < room.y+room.height-1; y+=2 ) {
					for( var x = room.x+1; x < room.x+room.width-1; x++ ) {
						var index = Utilities.positionToIndex(x,y,level.width);
						if( level.tiles[index].type == Level.Types.Wall && level.tiles[index].noblock == false ) {
							level.tiles[index].type = Level.Types.Prop;
							level.tiles[index].image = level.tileset.props[3];
						}
					}
				}
			}
			else if( rand < 0.8 ) {
				// lab
				for( var y = room.y; y < room.y+room.height; y++ ) {
					for( var x = Math.max(1,room.x); x < room.x+room.width; x++ ) {
						if( y == Math.max(1,room.y) || y == room.y+room.height-1 || x == room.x || x == room.x+room.width-1 ) {
							var index = Utilities.positionToIndex(x,y,level.width);
							if( level.tiles[index].type == Level.Types.Floor && level.tiles[index].noblock == false && Math.random() > 0.75) {
								level.tiles[index].type = Level.Types.Prop;
								var propImg = level.tileset.props[1];
					
								var propRnd = Math.random();
								if( propRnd > 0.9 ) propImg = level.tileset.props[2]
								else if( propRnd > 0.4 ) propImg = level.tileset.props[0]
								
								level.tiles[index].image = propImg;
							}
						}
					}
				}
			}
			else {
				// solarium
				for( var x = room.x; x < room.x+room.width; x++ ) {
					if( Math.random() > 0.8 ) {
						var index = Math.max(0,(room.y-1))*level.width+x;
						if( level.tiles[index].type == Level.Types.Wall && level.tiles[index].wallType == Level.WallTypes.Straight ) {
							level.tiles[index].image = level.tileset.walls.straights.horizontal[1];
							index = Math.max(1,(room.y))*level.width+x;
							level.tiles[index].image = level.tileset.floors[4];
						}
					}
				}
			}
		}
	}

	return result;
}
