
var HackGridGenerator = function() {
}

HackGridGenerator.maxNodeRatio = 0.15;
HackGridGenerator.maxFailAttempts = 500;

HackGridGenerator.generate = function( desiredSizeX, desiredSizeY, scene, difficulty ) {
	var hackGrid = new HackGrid( desiredSizeX, desiredSizeY, scene );

    var area = desiredSizeX * desiredSizeY;
    var numNodes = Math.round( area * this.maxNodeRatio );
    console.log( numNodes.toString() );
	
	hackGrid.playerGridPosX = 1,
    hackGrid.playerGridPosY = 1;

    hackGrid.goalGridPosX = 9;
    hackGrid.goalGridPosY = 7;

    var lastNode = null;
    var nodeCount = 0;
    var failures = 0;

    var nodes = [];

    // step1 : generate a trunk
    while( nodeCount < numNodes ) {
        var randPos = { x: Utilities.randRangeInt(0,desiredSizeX), y: Utilities.randRangeInt(0,desiredSizeY) };
        if( HackGridGenerator.canPlaceNode( hackGrid, nodes, randPos ) ) {
            lastNode = HackGridGenerator.createNode( hackGrid, randPos, HackNodeType.Mainframe, lastNode );
            nodes.push( lastNode );
            hackGrid.addNode( lastNode );
            failures = 0;
            ++nodeCount;
        }
        else if( ++failures > this.maxFailAttempts )
        {
            console.log( "Fail" + failures.toString() );
            failures = 0;
            ++nodeCount;
        }
    }

    // step 2 : make first connections
    var recursiveConnectToClosestUnconnected = function( node, nodes, hackGrid ) {
        if( node.connectedTo.length < 2 ) {
            var closest = HackGridGenerator.getClosestUnconnectedNode( node, nodes );
            if( closest != null ) {
                node.addConnection( closest );
                recursiveConnectToClosestUnconnected( closest, nodes, hackGrid );
            }
        }
    }

    recursiveConnectToClosestUnconnected( nodes[0], nodes, hackGrid );

	return hackGrid;
}

HackGridGenerator.createNode = function( hackGrid, at, nodeType, from ) {
    var node = new HackNode( at.x, at.y, HackNodeType.Neutral, hackGrid.scene );
    return node;
}

HackGridGenerator.canPlaceNode = function( hackGrid, nodes, at ) {
    if( !hackGrid.isValidGridPoint( at.x, at.y ) ) return false;

    var calcDist2 = function( p1, p2 ) {
        var delta = { x: p2.x - p1.x, y: p2.y - p1.y };
        return delta.x*delta.x+delta.y*delta.y;
    }

    for( var key in nodes ) {
        var node = nodes[key];
        var diff2 = calcDist2( node.getGridPos(), at );
        if( diff2 < 3 ) return false;
    }

    var connections = HackGridGenerator.getUniqueConnections( hackGrid );
    for( var key in connections ) {
        var connection = connections[key];
        if( Utilities.isPointOnLine( at, connection.segment ) ) return false;
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

HackGridGenerator.getClosestUnconnectedNode = function( node, nodes ) {
    var dist = 0;
    var result = null;

    var calcDist2 = function( p1, p2 ) {
        var delta = { x: p2.gridXPos - p1.gridXPos, y: p2.gridYPos - p1.gridYPos };
        return delta.x*delta.x+delta.y*delta.y;
    }

    for( var index = 0; index < nodes.length; ++index ) {
        var test = nodes[index];
        if( test != node && test.connectedTo.length == 0 ) {
            var newDist = calcDist2( node, test );
            if( result == null || newDist < dist ) {
                dist = newDist;
                result = test;
            } 
        }
    }

    return result;
}

HackGridGenerator.areConnected = function( node1, node2 ) {
    console.log( node1.connectedTo.indexOf( node2 ) );

    if( node1 == undefined || node1 == null || node2 == undefined || node2 == null ) debugger;
    var node2Uid = HackGridGenerator.getUniqueNodeName( node2 );
    for( var nodeIndex = 0; nodeIndex < node1.connectedTo.length; ++nodeIndex ) {
        var test = node1.connectedTo[ nodeIndex ];
        var testUid = HackGridGenerator.getUniqueNodeName( test );
        if( testUid == node2Uid ) return true;
    };

    return false;
}