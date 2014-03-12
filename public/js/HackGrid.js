    var HackGrid = function(desiredXSize, desiredYSize, scene)
{
	this.time = 0;
	this.scene = scene;

	this.playerNode = null;

	this.emptyTestArray = [];

	this.xSize = desiredXSize;
    this.ySize = desiredYSize;

    this.grid = [];
    this.nodes = [];
    this.nodeCount = 0;

    this.minGridX = 0;
    this.minGridY = 0;

    this.maxGridX = desiredXSize - 1;
    this.maxGridY = desiredYSize - 1;

    this.xGridLineCount = this.maxGridX + 2;
    this.yGridLineCount = this.maxGridY + 2;

    this.playerGridPosX = 0,
    this.playerGridPosY = 0;

    this.goalGridPosX = 0;
    this.goalGridPosY = 0;

    this.playerNode = null;
    this.mainframeNode = null;
    this.trueDataCacheNode = null;
    this.dataCacheNodes = [];

    for (i = 0; i < desiredXSize; i++)
    {
 
    	this.grid[i] = new Array();
    	for (j = 0; j < desiredYSize; j++)
  		{
  			this.grid[i][j] = 0;
    	}
    }
  	
    this.goalX = this.maxGridX - 1;
    this.goalY = this.maxGridY - 1;

};

HackGrid.prototype.hackingSimulationUpdate = function(delta)
{
	for (i=0; i<this.nodeCount;i++)
	{
		this.nodes[i].hackingSimulationUpdate(delta);
	}
};

HackGrid.prototype.update = function(delta)
{
	for (i=0; i<this.nodeCount;i++)
	{
		this.nodes[i].update(delta);
	}
};

HackGrid.prototype.updateBacktraceHighlights = function(delta)
{
	for (i=0; i<this.nodeCount;i++)
	{
		this.nodes[i].drawBacktraceHighlights(delta);
	}
};

HackGrid.prototype.updateNodeConnectionLines = function(delta)
{
	for (i=0; i<this.nodeCount;i++)
	{
		this.nodes[i].drawConnectorLines(delta);
	}
};

HackGrid.prototype.updateNodeHackedConnectionLines = function(delta)
{
    for (i=0; i<this.nodeCount;i++)
    {
        this.nodes[i].drawHackedConnectorLines(delta);
    }

    this.scene.updateHackingLines();
};


HackGrid.prototype.createNewNode = function(x, y, type)
{
    var result = new HackNode( x, y, type, this.scene );
	this.addNode( result );
    return result;
}

HackGrid.prototype.addNode = function( node )
{
    this.grid[node.gridXPos][node.gridYPos] = node;
    this.nodes.push(node);
    this.nodeCount++; 
}

HackGrid.prototype.hackNode = function(node)
{
	node.activelyBeingHacked = true;
	this.scene.playerActivelyHacking = true;
    this.scene.lastHackAttemptNode = node;
}

HackGrid.prototype.isValidGridPoint = function( x,y )
{
    return ( x >= this.minGridX && x <= this.maxGridX && y >= this.minGridY && y <= this.maxGridY );
}

HackGrid.prototype.getRandomNode = function()
{
    return this.nodes[ Utilities.randRangeInt( 0, this.nodes.length-1 ) ];
}

HackGrid.prototype.getRandomNodeInRange = function( from, min, max, maxFailures )
{
    return this.getRandomNodeDelegate( function( node ) {
        if( node.type != HackNodeType.Neutral ) return false;
        var path = HackGridUtilities.getPath( from, node );
        if( path.length >= min && path.length <= max ) return true;
        return false;
    }, maxFailures );
}

HackGrid.prototype.getRandomNeutralNode = function()
{
    return this.getRandomNodeDelegate( function( node ) {
        return node.type == HackNodeType.Neutral;
    });
}

HackGrid.prototype.getRandomNodeDelegate = function( delegate, maxFailures )
{
    if( maxFailures == undefined ) var maxFailures = 5000;
    var randNode = null;
    for( var i = 0; i < maxFailures; ++i )
    {
        randNode = this.getRandomNode();
        if( delegate( randNode ) )
        {
            return randNode;
        }
    }

    return randNode;
}

HackGrid.prototype.makeMainframe = function( node )
{
    node.type = HackNodeType.Mainframe;
    node.hostile = true;
    node.hackingDifficultyInSec = 45.0;
    node.mainframeDetectionChancePerc = 100.0;
    node.enmityGainIfDetected = 100.0;
    this.mainframeNode = node;
}

HackGrid.prototype.makePlayer = function( node )
{
    node.type = HackNodeType.Player;
    node.hacked = true;
    this.playerNode = node;
}

HackGrid.prototype.makeTrueDataCache = function( node )
{
    node.hackingDifficultyInSec = 6.0;
    node.mainframeDetectionChancePerc = 80.0 + this.scene.programDetectionModifier;
    node.enmityGainIfDetected = 25.0;
    node.isTrueDataCache = true;
    this.trueDataCacheNode = node;
    node.type = "goal";
}

HackGrid.prototype.makeFakeDataCache = function( node )
{
    node.hackingDifficultyInSec = 6.0;
    node.mainframeDetectionChancePerc = 80.0 + this.scene.programDetectionModifier;
    node.enmityGainIfDetected = 25.0;
    node.type = "goal";
}

HackGrid.prototype.makeNeutral = function( node )
{
    node.type = HackNodeType.Neutral;
    node.mainframeDetectionChancePerc = 25.0 + this.scene.programDetectionModifier;
    node.hackingDifficultyInSec = 3.0;
}