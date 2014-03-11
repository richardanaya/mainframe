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

    result.smashedProp = [Utilities.createImage( 'images/tilesets/office/floors/floor04.png' )],

    result.propSounds = [
        null,
        "sounds/sfx_ambience/sfx_ambience_stereo_lp_7.mp3",
        null,
        null
    ];

	result.doors = {
		vertical: [Utilities.createImage('images/tilesets/office/doors/door_v.png')],
		horizontal: [Utilities.createImage('images/tilesets/office/doors/door_h.png')],
	};

	result.doPropPass = function( level ) {
		for( var roomIndex = 0; roomIndex < level.rooms.length; roomIndex++ ) {
			var room = level.rooms[roomIndex];
			var rand = Math.random();
			if( rand < 0.7 ) {
				var area = room.width * room.height;
				var numClutterChances = Math.round( area * 0.1 );
				for( var i = 0; i < 10; i++ ) {
					if( Math.random() < 1 ) {
						var x = Utilities.randRangeInt( room.x+1, room.x+room.width-1 );
						var y = Utilities.randRangeInt( room.y+1, room.y+room.height-1 );

						var choice = Math.random();
						var propType = 0;
						if( choice < 0.05 ) {
							propType = 2;
						}
						else if( choice < 0.45 ) {
							propType = 1
						}
						
						var index = Utilities.positionToIndex(x,y,level.width);
						if( level.tiles[index].type != Level.Types.Wall && level.tiles[index].noblock == false ) {
							level.tiles[index].type = Level.Types.Prop;
							level.tiles[index].image = level.tileset.props[propType];
                            level.tiles[index].ambient = level.tileset.propSounds[propType];

							if( propType == 2 ) { //lamp
								var light = new Light( '['+x+','+y+']',x,y,1,0.2);
								light.room = room;
								level.lights.push( light );
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
							var light = new Light( '['+x+','+room.y+']',x,room.y,1,0.2);
							light.room = room;
							level.lights.push( light );

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

Tileset.createLabTileset = function() {
    var result = new Tileset();
    result.floors = [
        Utilities.createImage( 'images/tilesets/lab/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/lab/floors/floor02.png' ),
        Utilities.createImage( 'images/tilesets/lab/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/lab/floors/floor02.png' ),
        Utilities.createImage( 'images/tilesets/lab/floors/floor_windowlight.png' )
    ];

    result.edging = {
        north: 			[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_top.png' )],
        northeast: 		[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_topright.png' )],
        east: 			[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_right.png' )],
        southeast: 		[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_bottomright.png' )],
        south: 			[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_bottom.png' )],
        southwest: 		[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_bottomleft.png' )],
        west: 			[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_left.png' )],
        northwest:	 	[Utilities.createImage( 'images/tilesets/lab/floors/floor_shadow_topleft.png' )],
    };

    result.walls = {
        pillars: [ Utilities.createImage('images/grass.png') ],
        crosses: [ Utilities.createImage('images/tilesets/lab/walls/wall_cross.png') ],
        endcaps: {
            north: [Utilities.createImage('images/tilesets/lab/walls/wall_cap_n.png')],
            east: [Utilities.createImage('images/tilesets/lab/walls/wall_cap_e.png')],
            south: [Utilities.createImage('images/tilesets/lab/walls/wall_cap_s.png')],
            west: [Utilities.createImage('images/tilesets/lab/walls/wall_cap_w.png')]
        },
        corners: {
            northwest: [Utilities.createImage('images/tilesets/lab/walls/wall_corner_nw.png')],
            northeast: [Utilities.createImage('images/tilesets/lab/walls/wall_corner_ne.png')],
            southeast: [Utilities.createImage('images/tilesets/lab/walls/wall_corner_se.png')],
            southwest: [Utilities.createImage('images/tilesets/lab/walls/wall_corner_sw.png')]
        },
        straights: {
            vertical: [Utilities.createImage('images/tilesets/lab/walls/wall_straight_ns.png')],
            horizontal: [
                Utilities.createImage('images/tilesets/lab/walls/wall_straight_ew01.png'),
                Utilities.createImage('images/tilesets/lab/walls/wall_straight_ew02.png')
            ]
        },
        tjoins: {
            north: [Utilities.createImage('images/tilesets/lab/walls/wall_tjoin_n.png')],
            east: [Utilities.createImage('images/tilesets/lab/walls/wall_tjoin_e.png')],
            south: [Utilities.createImage('images/tilesets/lab/walls/wall_tjoin_s.png')],
            west: [Utilities.createImage('images/tilesets/lab/walls/wall_tjoin_w.png')]
        },
    };

    result.props = [
        Utilities.createImage('images/tilesets/lab/props/prop01.png'),
        Utilities.createImage('images/tilesets/lab/props/prop02.png'),
        Utilities.createImage('images/tilesets/lab/props/prop03.png'),
        Utilities.createImage('images/tilesets/lab/props/prop04.png'),
    ];

    result.smashedProp = [Utilities.createImage( 'images/tilesets/lab/floors/floor01.png' )],

    result.propSounds = [
        null,
        "sounds/sfx_general/sfx_object_hum_lp_6.mp3",
        null,
        null
    ];

    result.doors = {
        vertical: [Utilities.createImage('images/tilesets/lab/doors/door_v.png')],
        horizontal: [Utilities.createImage('images/tilesets/lab/doors/door_h.png')],
    };

    result.doPropPass = function( level ) {
        for( var roomIndex = 0; roomIndex < level.rooms.length; roomIndex++ ) {
            var room = level.rooms[roomIndex];
            var rand = Math.random();
            if( rand < 0.7 ) {
                var area = room.width * room.height;
                var numClutterChances = Math.round( area * 0.1 );
                for( var i = 0; i < 10; i++ ) {
                    if( Math.random() < 1 ) {
                        var x = Utilities.randRangeInt( room.x+1, room.x+room.width-1 );
                        var y = Utilities.randRangeInt( room.y+1, room.y+room.height-1 );

                        var choice = Math.random();
                        var propType = 0;
                        if( choice < 0.05 ) {
                            propType = 2;
                        }
                        else if( choice < 0.45 ) {
                            propType = 1
                        }

                        var index = Utilities.positionToIndex(x,y,level.width);
                        if( level.tiles[index].type != Level.Types.Wall && level.tiles[index].noblock == false ) {
                            level.tiles[index].type = Level.Types.Prop;
                            level.tiles[index].image = level.tileset.props[propType];

                            if( propType == 2 ) { //lamp
                                var light = new Light( '['+x+','+y+']',x,y,1,0.2);
                                light.room = room;
                                level.lights.push( light );
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
                            var light = new Light( '['+x+','+room.y+']',x,room.y,1,0.2);
                            light.room = room;
                            level.lights.push( light );

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

Tileset.createBasementTileset = function() {
    var result = new Tileset();
    result.floors = [
        Utilities.createImage( 'images/tilesets/basement/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/basement/floors/floor02.png' ),
    ];

    result.edging = {
        north: 			[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_top.png' )],
        northeast: 		[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_topright.png' )],
        east: 			[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_right.png' )],
        southeast: 		[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_bottomright.png' )],
        south: 			[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_bottom.png' )],
        southwest: 		[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_bottomleft.png' )],
        west: 			[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_left.png' )],
        northwest:	 	[Utilities.createImage( 'images/tilesets/basement/floors/floor_shadow_topleft.png' )],
    };

    result.walls = {
        pillars: [ Utilities.createImage('images/grass.png') ],
        crosses: [ Utilities.createImage('images/tilesets/basement/walls/wall_cross.png') ],
        endcaps: {
            north: [Utilities.createImage('images/tilesets/basement/walls/wall_cap_n.png')],
            east: [Utilities.createImage('images/tilesets/basement/walls/wall_cap_e.png')],
            south: [Utilities.createImage('images/tilesets/basement/walls/wall_cap_s.png')],
            west: [Utilities.createImage('images/tilesets/basement/walls/wall_cap_w.png')]
        },
        corners: {
            northwest: [Utilities.createImage('images/tilesets/basement/walls/wall_corner_nw.png')],
            northeast: [Utilities.createImage('images/tilesets/basement/walls/wall_corner_ne.png')],
            southeast: [Utilities.createImage('images/tilesets/basement/walls/wall_corner_se.png')],
            southwest: [Utilities.createImage('images/tilesets/basement/walls/wall_corner_sw.png')]
        },
        straights: {
            vertical: [Utilities.createImage('images/tilesets/basement/walls/wall_straight_ns.png')],
            horizontal: [
                Utilities.createImage('images/tilesets/basement/walls/wall_straight_ew01.png'),
                Utilities.createImage('images/tilesets/basement/walls/wall_straight_ew01.png')
            ]
        },
        tjoins: {
            north: [Utilities.createImage('images/tilesets/basement/walls/wall_tjoin_n.png')],
            east: [Utilities.createImage('images/tilesets/basement/walls/wall_tjoin_e.png')],
            south: [Utilities.createImage('images/tilesets/basement/walls/wall_tjoin_s.png')],
            west: [Utilities.createImage('images/tilesets/basement/walls/wall_tjoin_w.png')]
        },
    };

    result.props = [
        Utilities.createImage('images/tilesets/basement/props/prop01.png'),
        Utilities.createImage('images/tilesets/basement/props/prop02.png'),
        Utilities.createImage('images/tilesets/basement/props/prop03.png'),
    ];

    result.smashedProp = [Utilities.createImage( 'images/tilesets/basement/floors/floor01.png' )],

    result.propSounds = [
        "sounds/sfx_ambience/sfx_ambience_stereo_lp_4.mp3",
        "sounds/sfx_ambience/sfx_ambience_stereo_lp_5.mp3",
        "sounds/sfx_ambience/sfx_ambience_stereo_lp_8.mp3"
    ];

    result.doors = {
        vertical: [Utilities.createImage('images/tilesets/basement/doors/door_v.png')],
        horizontal: [Utilities.createImage('images/tilesets/basement/doors/door_h.png')],
    };

    result.doPropPass = function( level ) {
        for( var roomIndex = 0; roomIndex < level.rooms.length; roomIndex++ ) {
            var room = level.rooms[roomIndex];
            var area = room.width * room.height;
            var numClutterChances = Math.round( area * 0.1 );
            for( var i = 0; i < 10; i++ ) {
                if( Math.random() < 1 ) {
                    var x = Utilities.randRangeInt( room.x+1, room.x+room.width-1 );
                    var y = Utilities.randRangeInt( room.y+1, room.y+room.height-1 );

                    var choice = Math.random();
                    var propType = 0;
                    if( choice < 0.05 ) {
                        propType = 2;
                    }
                    else if( choice < 0.45 ) {
                        propType = 1
                    }

                    var index = Utilities.positionToIndex(x,y,level.width);
                    if( level.tiles[index].type != Level.Types.Wall && level.tiles[index].noblock == false ) {
                        level.tiles[index].type = Level.Types.Prop;
                        level.tiles[index].image = level.tileset.props[propType];

                        if( propType == 2 ) { //lamp
                            var light = new Light( '['+x+','+y+']',x,y,1,0.2);
                            light.room = room;
                            level.lights.push( light );
                        }
                    }
                }
            }
        }
    }

    return result;
}

Tileset.createMainframeTileset = function() {
    var result = new Tileset();
    result.floors = [
        Utilities.createImage( 'images/tilesets/mainframe/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/mainframe/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/mainframe/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/mainframe/floors/floor01.png' ),
        Utilities.createImage( 'images/tilesets/mainframe/floors/floor01.png' ),
    ];

    result.edging = {
        north: 			[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_top.png' )],
        northeast: 		[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_topright.png' )],
        east: 			[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_right.png' )],
        southeast: 		[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_bottomright.png' )],
        south: 			[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_bottom.png' )],
        southwest: 		[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_bottomleft.png' )],
        west: 			[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_left.png' )],
        northwest:	 	[Utilities.createImage( 'images/tilesets/mainframe/floors/floor_shadow_topleft.png' )],
    };

    result.walls = {
        pillars: [ Utilities.createImage('images/grass.png') ],
        crosses: [ Utilities.createImage('images/tilesets/mainframe/walls/wall_cross.png') ],
        endcaps: {
            north: [Utilities.createImage('images/tilesets/mainframe/walls/wall_cap_n.png')],
            east: [Utilities.createImage('images/tilesets/mainframe/walls/wall_cap_e.png')],
            south: [Utilities.createImage('images/tilesets/mainframe/walls/wall_cap_s.png')],
            west: [Utilities.createImage('images/tilesets/mainframe/walls/wall_cap_w.png')]
        },
        corners: {
            northwest: [Utilities.createImage('images/tilesets/mainframe/walls/wall_corner_nw.png')],
            northeast: [Utilities.createImage('images/tilesets/mainframe/walls/wall_corner_ne.png')],
            southeast: [Utilities.createImage('images/tilesets/mainframe/walls/wall_corner_se.png')],
            southwest: [Utilities.createImage('images/tilesets/mainframe/walls/wall_corner_sw.png')]
        },
        straights: {
            vertical: [Utilities.createImage('images/tilesets/mainframe/walls/wall_straight_ns.png')],
            horizontal: [
                Utilities.createImage('images/tilesets/mainframe/walls/wall_straight_ew01.png'),
                Utilities.createImage('images/tilesets/mainframe/walls/wall_straight_ew02.png')
            ]
        },
        tjoins: {
            north: [Utilities.createImage('images/tilesets/mainframe/walls/wall_tjoin_n.png')],
            east: [Utilities.createImage('images/tilesets/mainframe/walls/wall_tjoin_e.png')],
            south: [Utilities.createImage('images/tilesets/mainframe/walls/wall_tjoin_s.png')],
            west: [Utilities.createImage('images/tilesets/mainframe/walls/wall_tjoin_w.png')]
        },
    };

    result.props = [
        Utilities.createImage('images/tilesets/mainframe/props/prop01.png'),
        Utilities.createImage('images/tilesets/mainframe/props/prop02.png'),
        Utilities.createImage('images/tilesets/mainframe/props/prop03.png')
    ];

    result.smashedProp = [Utilities.createImage( 'images/tilesets/mainframe/floors/floor01.png' )],

    result.propSounds = [
        null,
        null,
        null
    ];

    result.doors = {
        vertical: [Utilities.createImage('images/tilesets/mainframe/doors/door_v.png')],
        horizontal: [Utilities.createImage('images/tilesets/mainframe/doors/door_h.png')],
    };

    result.doPropPass = function( level ) {
        for( var roomIndex = 0; roomIndex < level.rooms.length; roomIndex++ ) {
            var room = level.rooms[roomIndex];
            var rand = Math.random();
            if( rand < 0.7 ) {
                var area = room.width * room.height;
                var numClutterChances = Math.round( area * 0.1 );
                for( var i = 0; i < 10; i++ ) {
                    if( Math.random() < 1 ) {
                        var x = Utilities.randRangeInt( room.x+1, room.x+room.width-1 );
                        var y = Utilities.randRangeInt( room.y+1, room.y+room.height-1 );

                        var choice = Math.random();
                        var propType = 0;
                        if( choice < 0.05 ) {
                            propType = 2;
                        }
                        else if( choice < 0.45 ) {
                            propType = 1
                        }

                        var index = Utilities.positionToIndex(x,y,level.width);
                        if( level.tiles[index].type != Level.Types.Wall && level.tiles[index].noblock == false ) {
                            level.tiles[index].type = Level.Types.Prop;
                            level.tiles[index].image = level.tileset.props[propType];

                            if( propType == 2 ) { //lamp
                                var light = new Light( '['+x+','+y+']',x,y,1,0.2);
                                light.room = room;
                                level.lights.push( light );
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
                            var light = new Light( '['+x+','+room.y+']',x,room.y,1,0.2);
                            light.room = room;
                            level.lights.push( light );

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