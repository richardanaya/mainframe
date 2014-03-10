    var HackGrid = function(desiredXSize, desiredYSize, scene)
{
	this.time = 0;
	this.scene = scene;

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
}

HackGrid.prototype.isValidGridPoint = function( x,y )
{
    return ( x >= this.minGridX && x <= this.maxGridX && y >= this.minGridY && y <= this.maxGridY );
}