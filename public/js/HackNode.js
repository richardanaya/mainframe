var HackNode = function(gridXPos, gridYPos, type, scene)
{
	this.gridXPos = gridXPos;
	this.gridYPos = gridYPos;
	this.type = type;
	this.hostile = false;
	this.connectedTo = [];
	this.hackingScene = scene;
	this.localBacktraceComplete = false;
};

HackNode.prototype.update = function(delta)
{
	this.hackingScene.drawCircleAtGridPos(this.gridXPos, this.gridYPos, this.type);

};

HackNode.prototype.drawBacktraceHighlights = function(delta)
{
	if (((this.hackingScene.mainframeEnmity > 0) && (this.type == "mainframe")) ||
		((this.hackingScene.mainframeEnmity > 0) && (this.hostile == true)))
	{
		this.hackingScene.drawBacktraceCircleAtGridPos(this.gridXPos, this.gridYPos);
	
		for (var i = 0; i < this.connectedTo.length; i++)
		{
			
			this.hackingScene.drawBacktraceLines(this.gridXPos,
														this.gridYPos,
														this.connectedTo[0].gridXPos,
														this.connectedTo[0].gridYPos);
			
		}
	}

};


HackNode.prototype.drawConnectorLines = function(delta)
{
	for (var i = 0; i < this.connectedTo.length; i++)
	{
		this.hackingScene.lineConnectTwoGridObjects(this.gridXPos,
													this.gridYPos,
													this.connectedTo[0].gridXPos,
													this.connectedTo[0].gridYPos);
	}

};

HackNode.prototype.addConnection = function(connection)
{
	this.connectedTo.push(connection);
}