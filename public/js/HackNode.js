var HackNodeType = {
	Mainframe : "mainframe",
	Neutral: "neutral",
	Player: "player",
	Goal: "goal"
}

var HackNode = function(gridXPos, gridYPos, type, scene)
{
	this.gridXPos = gridXPos;
	this.gridYPos = gridYPos;
	this.type = type;
	this.hostile = false;
	this.hacked = false;
	this.activelyBeingHacked = false;
	this.hackingProgress = 0.0;
	this.hackingDifficultyInSec = 4.0;
	this.mainframeDetectionChancePerc = 25.0;
	this.enmityGainIfDetected = 10.0;
	this.connectedTo = [];
	this.hackingScene = scene;
	this.localBacktraceComplete = false;
	this.backtracePercentProgress = 0.0;

	if (this.type == "mainframe")
	{
		this.hostile = true;
		this.backtracePercentProgress = 100.0;
	}

	else if (this.type == "player")
	{
		this.hacked = true;
	}

};

HackNode.prototype.hackingSimulationUpdate = function(delta)
{
	if (!this.hackingScene.hackingFullyBacktraced)
	{
		if (this.activelyBeingHacked == true)
		{
			if (this.hackingProgress == 0.0)
			{
				var randomNumber = Math.ceil(Math.random()*100)
				if (randomNum < this.mainframeDetectionChancePerc)
					this.hackingScene.mainframeEnmity += this.enmityGainIfDetected;
			}

			this.hackingProgress += delta;

			if (this.hackingProgress >= this.hackingDifficultyInSec)
			{
				this.hacked = true;
				this.activelyBeingHacked = false;
				this.hackingScene.playerActivelyHacking = false;
			}
		}



		else if (((this.hackingScene.mainframeEnmity > 0) && (this.type == "mainframe")) ||
			((this.hackingScene.mainframeEnmity > 0) && (this.hostile == true)))
		{
			for (var i = 0; i < this.connectedTo.length; i++)
			{
		
				if (this.connectedTo[i].hostile == false)
				{
					//at 100% mainframe enmity it will take 2.5 seconds per node. at 50%, 5.0 seconds.
					this.connectedTo[i].backtracePercentProgress += delta * 40 * (this.hackingScene.mainframeEnmity/100) ;

					if (this.connectedTo[i].backtracePercentProgress >= 100.0)
					{
						this.connectedTo[i].hostile = true;
						if (this.connectedTo[i].type == "player")
							this.hackingScene.hackingFullyBacktraced = true;
						
						/*
						//coded for debug purposes
						var date = new Date();
						console.log("Node " + this.connectedTo[i].gridXPos + ":" + this.connectedTo[i].gridYPos + 
									" was backtraced at " + date.getMinutes() + " min, " + date.getSeconds() + 
									"sec, " + date.getMilliseconds() + " milliSec");
						*/
						
					}
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
