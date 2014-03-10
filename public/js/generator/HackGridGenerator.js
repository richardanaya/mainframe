
var HackGridGenerator = function() {
}

HackGridGenerator.maxNodeRatio = .07;
HackGridGenerator.maxFailAttempts = 50;

HackGridGenerator.generate = function( desiredSizeX, desiredSizeY, scene, difficulty ) {
	var hackGrid = new HackGrid( desiredSizeX, desiredSizeY, scene );

    var area = desiredSizeX * desiredSizeY;
    var numNodes = Math.floor( area * this.maxNodeRatio );
	
	hackGrid.playerGridPosX = 1,
    hackGrid.playerGridPosY = 1;

    hackGrid.goalGridPosX = 9;
    hackGrid.goalGridPosY = 7;

    var lastNode = null;
    var nodeCount = 0;
    var failures = 0;

    var nodes = [];
    while( nodeCount < numNodes ) {
        var randPos = { x: Utilities.randRangeInt(0,desiredSizeX), y: Utilities.randRangeInt(0,desiredSizeY) };
        if( HackGridGenerator.canPlaceNode( hackGrid, nodes, randPos ) ) {
            lastNode = HackGridGenerator.createNode( hackGrid, randPos, HackNodeType.Mainframe, lastNode );
            nodes.push( lastNode );
            ++nodeCount;
            failures = 0;
        }
        else if( ++failures > this.maxFailAttempts )
        {
            ++nodeCount;
        }
    }

    nodes.forEach( function( node ) {
        var closest = [];
        var test = HackGridGenerator.getClosestNode( node, nodes );
        closest.push( test );
        closest.forEach( function( close ) {
            close.addConnection( node );
        });

        hackGrid.addNode( node );
    });

    

	return hackGrid;
}

HackGridGenerator.createNode = function( hackGrid, at, nodeType, from ) {
    var node = new HackNode( at.x, at.y, HackNodeType.Neutral, hackGrid.scene );
    return node;
}

HackGridGenerator.canPlaceNode = function( hackGrid, nodes, at ) {
    if( !hackGrid.isValidGridPoint( at.x, at.y ) ) return false;

    for( var x = at.x-1; x < at.x+1; ++x ) {
        for( var y = at.y-1; y < at.y+1; ++y ) {
            if( hackGrid.isValidGridPoint( x, y ) ) {
                var isGood = true;
                nodes.forEach( function( exist ) {
                    if( exist.gridXPos == x || exist.gridYPos == y ) isGood = false;
                });
                if( !isGood ) return false;
            }
        }
    }

    return true;
}

HackGridGenerator.attemptConnection = function( hackGrid, node, suggestedConnection ) {
    var desiredLineSegment = [node.getGridPos(),suggestedConnection.getGridPos()];
    var result = HackGridGenerator.canMakeConnection( hackGrid, desiredLineSegment );
    if( result == false ) {
        hackGrid.nodes.forEach( function( tryNode ) {
            desiredLineSegment = [node.getGridPos(),tryNode.getGridPos()];
            if( HackGridGenerator.canMakeConnection( hackGrid, desiredLineSegment ) ) {
                suggestedConnection = tryNode;
                return;
            }
        });
    }
    
    if( result ) {
        node.addConnection( suggestedConnection );
    }

    return result;
}

HackGridGenerator.canMakeConnection = function( hackGrid, desiredLineSegment ) {
    var connections = HackGridGenerator.getUniqueConnections( hackGrid );
    for( var key in connections ) {
        var connection = connections[key];
        if( Utilities.doLineSegmentsIntersect( desiredLineSegment, connection.segment ) ) {
            return false;
        }
    };

    return true;
}

HackGridGenerator.getUniqueConnections = function( hackGrid ) {
    var result = {};
    hackGrid.nodes.forEach( function(node1) {
        node1.connectedTo.forEach( function(node2) {
            var connection = HackGridGenerator.getConnection( node1, node2 );
            result[connection.uid] = connection;
        });
    });

    return result;
}

HackGridGenerator.getConnection = function( node1, node2 ) {
    if( node1 == null || node1 == undefined || node2 == null || node2 == undefined ) return null;
    var result = {
        nodes: [],
        segment: null,
        uid: null
    };

    if( node1.gridXPos == node2.gridXPos ) {
        if( node1.gridYPos < node2.gridYPos ) {
            result.nodes.push( node1 );
            result.nodes.push( node2 );
        }
        else
        {
            result.nodes.push( node2 );
            result.nodes.push( node1 );
        }
    }
    else if( node1.gridXPos < node2.gridXPos ) {
        result.nodes.push( node1 );
        result.nodes.push( node2 );
    }
    else
    {
        result.nodes.push( node2 );
        result.nodes.push( node1 );
    }

    result.segment = [result.nodes[0].getGridPos(), result.nodes[1].getGridPos()];
    result.uid = HackGridGenerator.getUniqueNodeName( result.nodes[0] ) + ":" + HackGridGenerator.getUniqueNodeName( result.nodes[1] );
    return result;
}

HackGridGenerator.getUniqueNodeName = function( node ) {
    return node.gridXPos.toString() + "," + node.gridYPos.toString();
}

HackGridGenerator.getClosestNode = function( node, nodes, ignore ) {
    var dist = 0;
    var result = null;

    var calcDist2 = function( p1, p2 ) {
        var delta = { x: p2.gridXPos - p1.gridXPos, y: p2.gridYPos - p1.gridYPos };
        return delta.x*delta.x+delta.y*delta.y;
    }

    nodes.forEach( function( test ) {
        if( result == null ) {
            dist = calcDist2(node,test);
            result = test;
        }
        else if( node.connectedTo.indexOf(test) == -1 && test.connectedTo.length < 3 && (ignore == undefined || ignore != test ) ) {

            var testDist = calcDist2( node, test );
            if( testDist < dist ) {
                result = test;
                dist = testDist;
            }
        }
    });

    if( result == null ) debugger;

    return result;
}