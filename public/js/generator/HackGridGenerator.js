var HackGridUtilities = function() {};


//usage//
// var path = HackGridUtilities.getPath( aNode, anotherNode ) );
// result is an array of nodes between (and including) the start and end nodes
HackGridUtilities.getPath = function( node1, node2 ) {
    var recursiveSearch = function( current, destination, path, explored ) {
        if( current == destination )  {
            path.push( current );
            return path;
        }
        if( explored.indexOf( current ) != -1 ) return null;
        explored.push( current );
        for( var i = 0; i < current.connectedTo.length; ++i ) {
            var nextNode = current.connectedTo[i];
            var result = recursiveSearch( nextNode, destination, [current], explored );
            if( result != null )
            {
                return path.concat( result );
            }
        }

        return null;
    }

    return recursiveSearch( node1, node2, [node1], [] );
}   

// var steps = HackGridUtilities.getStepsToClosestHacked( aNode );
// steps is an integer for the number of nodes.
HackGridUtilities.getStepsToClosestHacked = function( node ) {
    var recursiveSearch = function( current, explored ) {
        if( current.hacked ) return 0;
        if( explored.indexOf(current) != -1 ) return null;
        explored.push( current );
        for( var i = 0; i < current.connectedTo.length; ++i ) {
            var next = current.connectedTo[i];
            var res = recursiveSearch( next, explored );
            if( res != null ) {
                return res + 1;
            }
        }

        return null;
    }

    return recursiveSearch( node, [] );
}


var HackGridGenerator = function() {
}

HackGridGenerator.maxNodeRatio = 0.5;
HackGridGenerator.trunkToNodeRatio = .01;
HackGridGenerator.maxFailAttempts = 1000;

HackGridGenerator.generate = function( desiredSizeX, desiredSizeY, scene, difficulty ) {
	var hackGrid = new HackGrid( desiredSizeX, desiredSizeY, scene );

    var area = desiredSizeX * desiredSizeY;
    var numNodes = Math.round( area * this.maxNodeRatio );
    var numTrunkNodes = Math.round( numNodes * HackGridGenerator.trunkToNodeRatio );

    var lastNode = null;
    var nodeCount = 0;
    var failures = 0;

    var nodes = [];

    // step1 : generate a trunk
    while( nodeCount < numTrunkNodes ) {
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

    // step 2 : make trunk connections
    var recursiveConnectToClosestUnconnected = function( node, nodes, hackGrid ) {
        if( node.connectedTo.length < 2 ) {
            var closest = HackGridGenerator.getClosestNode( node, nodes, 0 );
            if( closest != null ) {
                node.addConnection( closest );
                recursiveConnectToClosestUnconnected( closest, nodes, hackGrid );
            }
        }
    }

    recursiveConnectToClosestUnconnected( nodes[0], nodes, hackGrid );


    // step 3 : ranomly place remaining nodes
    // immediately connect them so there are no islands
    nodeCount = 0;
    while( nodeCount < (numNodes-numTrunkNodes) ) {
        var randPos = { x: Utilities.randRangeInt(0,desiredSizeX), y: Utilities.randRangeInt(0,desiredSizeY) };
        if( HackGridGenerator.canPlaceNode( hackGrid, nodes, randPos ) ) {
            lastNode = HackGridGenerator.createNode( hackGrid, randPos, HackNodeType.Mainframe, lastNode );

            var closest = HackGridGenerator.getClosestNode( lastNode, nodes );
            if( closest != null /*&& HackGridGenerator.canMakeConnection( hackGrid, [lastNode.getGridPos(),closest.getGridPos()] )*/) {
                lastNode.addConnection( closest );
                nodes.push( lastNode );
                hackGrid.addNode( lastNode );
                failures = 0;
                ++nodeCount;
            }

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

    HackGridGenerator.setupNodes(hackGrid);
	return hackGrid;
}

HackGridGenerator.setupNodes = function ( hackGrid )
{
    hackGrid.makePlayer( hackGrid.getRandomNeutralNode() );
    hackGrid.makeMainframe( hackGrid.getRandomNodeInRange( hackGrid.playerNode, 3, 8 ) );

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

/*
    var connections = HackGridGenerator.getUniqueConnections( hackGrid );
    for( var key in connections ) {
        var connection = connections[key];
        if( Utilities.isPointOnLine( at, connection.segment ) ) return false;
    }
*/

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

HackGridGenerator.getClosestNode = function( node, nodes, connectionLimit ) {
    var dist = 0;
    var result = null;

    var calcDist2 = function( p1, p2 ) {
        var delta = { x: p2.gridXPos - p1.gridXPos, y: p2.gridYPos - p1.gridYPos };
        return delta.x*delta.x+delta.y*delta.y;
    }

    for( var index = 0; index < nodes.length; ++index ) {
        var test = nodes[index];
        if( test != node && (connectionLimit == undefined || test.connectedTo.length <= connectionLimit)) {
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

