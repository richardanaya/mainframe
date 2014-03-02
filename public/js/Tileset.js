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
		Utilities.createImage( 'images/tilesets/office/floors/floor04.png' )
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
			horizontal: [Utilities.createImage('images/tilesets/office/walls/wall_straight_ew01.png')]
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

	return result;
}
