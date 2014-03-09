var HackNode = function(gridXPos, gridYPos, type, scene)
{
	this.gridXPos = gridXPos;
	this.gridYPos = gridYPos;
	this.type = type;
	this.hostile = false;
	this.connectedTo = [];
	this.hackingScene = scene;
	this.localBacktraceComplete = false;
	this.backtracePercentProgress = 0.0;

	if (this.type == "mainframe")
	{
		this.hostile = true;
		this.backtracePercentProgress = 100.0;
	}

};

HackNode.prototype.hackingSimulationUpdate = function(delta)
{
	if (((this.hackingScene.mainframeEnmity > 0) && (this.type == "mainframe")) ||
		((this.hackingScene.mainframeEnmity > 0) && (this.hostile == true)))
	{
		for (var i = 0; i < this.connectedTo.length; i++)
		{
	
			if (this.connectedTo[i].hostile == false)
			{
				this.connectedTo[i].backtracePercentProgress += delta * 20;

				if (this.connectedTo[i].backtracePercentProgress >= 100.0)
				{
					this.connectedTo[i].hostile = true;
					/*
					//coded for debug purposes
					var date = new Date();
					console.log("Node " + this.connectedTo[i].gridXPos + ":" + this.connectedTo[i].gridYPos + 
								" was backtraced at " + date.getMinutes() + " min, " + date.getSeconds() + " seconds.");
					*/
				}
			}
		}

	}

};

HackNode.prototype.update = function(delta)
{
	this.hackingScene.drawCircleAtGridPos(this.gridXPos, this.gridYPos, this.type);
};

HackNode.prototype.drawBacktraceHighlights = function(delta)
{
	if ((this.type == "mainframe") || (this.hostile == true))
	{
		this.hackingScene.drawBacktraceCircleAtGridPos(this.gridXPos, this.gridYPos);
	}

	if (((this.hackingScene.mainframeEnmity > 0) && (this.type == "mainframe")) ||
		((this.hackingScene.mainframeEnmity > 0) && (this.hostile == true)))
	{
		for (var i = 0; i < this.connectedTo.length; i++)
		{
			var fullyBacktraced = false;

			if (this.connectedTo[i].hostile == true)
				fullyBacktraced = true;

			this.hackingScene.drawBacktraceLines(this.gridXPos,
												 this.gridYPos,
												 this.connectedTo[i].gridXPos,
												 this.connectedTo[i].gridYPos,
												 fullyBacktraced);
			
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

	connection.connectedTo.push(this);
}