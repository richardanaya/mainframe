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
