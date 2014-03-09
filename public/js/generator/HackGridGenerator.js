
var HackGridGenerator = function() {
}

HackGridGenerator.maxNodeRatio = .07;

HackGridGenerator.generate = function( desiredSizeX, desiredSizeY, scene, difficulty ) {
	var hackGrid = new HackGrid( desiredSizeX, desiredSizeY, scene );

    var area = desiredSizeX * desiredSizeY;
    var numNodes = Math.floor( area * this.maxNodeRatio );
	
	hackGrid.playerGridPosX = 1,
    hackGrid.playerGridPosY = 1;

    hackGrid.goalGridPosX = 9;
    hackGrid.goalGridPosY = 7;

    var lastNode = null;
    for( var nodeIter = 0; nodeIter < numNodes; ++nodeIter ) {
        var randPos = { x: Utilities.randRangeInt(0,desiredSizeX), y: Utilities.randRangeInt(0,desiredSizeY) };
        if( HackGridGenerator.canPlaceNode( hackGrid, randPos ) ) {
            lastNode = HackGridGenerator.createNode( hackGrid, randPos, HackNodeType.Mainframe, null );
        }
    }

	return hackGrid;
}

HackGridGenerator.createNode = function( hackGrid, at, nodeType, from ) {
    var node = hackGrid.createNewNode( at.x, at.y, nodeType );
    if( from != null && from != undefined ) {
        node.addConnection( hackGrid.grid[from.gridXPos,from.gridYPos] );
    }
}

HackGridGenerator.canPlaceNode = function( hackGrid, at ) {
    for( var x = at.x-1; x < at.x+2; ++x ) {
        for( var y = at.y-1; y < at.y+2; ++y ) {
            if( hackGrid.grid[x][y] != 0 ) return false;
        }
    }

    return true;
}