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
	this.mainframeDetectionChancePerc = 0.0;
	this.enmityGainIfDetected = 10.0;
	this.connectedTo = [];
	this.hackingScene = scene;
	this.localBacktraceComplete = false;
	this.backtracePercentProgress = 0.0;
	this.isTrueDataCache = false;
	this.isSUDOInspected = false;

	this.neutralImage = Resources.getImage("neutral_node");
	this.mainframeImage = Resources.getImage("mainframe_node");
	this.midHackNeutralImage = Resources.getImage("neutral_node_mid_hack");
	this.playerImage = Resources.getImage("entry_node");
	this.hackedImage = Resources.getImage("neutral_node_hacked");
	this.dataCacheImage = Resources.getImage("datacache_node");
	this.hackedEmptyDataCacheImage = Resources.getImage("datacache_node_false");
	this.midHackDataCacheImage = Resources.getImage("datacache_node_mid_hack");
	this.trueDataCacheImage = Resources.getImage("datacache_node_true");
	this.angryMainframe = Resources.getImage("mainframe_node_angry");

	/*
	if (this.type == "mainframe")
	{
		this.hostile = true;
		this.backtracePercentProgress = 100.0;
		this.hackingDifficultyInSec = 120.00;
		this.mainframeDetectionChancePerc = 100.0;
		this.enmityGainIfDetected = 100.00;
	}

	else if (this.type == "player")
	{
		this.hacked = true;
	}

	else if (this.type == "goal")
	{
		this.hackingDifficultyInSec = 10.0;
		this.mainframeDetectionChancePerc = 80.0;
		this.enmityGainIfDetected = 25.00;
	}
	*/

};

HackNode.prototype.getGridPos = function() {
	return { x: this.gridXPos, y: this.gridYPos };
}

HackNode.prototype.hackingSimulationUpdate = function(delta)
{
	if ((this.hackingScene.hackingFullyBacktraced == false) && (this.hackingScene.goalFound == false))
	{
		if (this.activelyBeingHacked == true)
		{
			if (this.hackingProgress == 0.0)
			{	
				/*
				var date = new Date();
				console.log("Hack start time: " +date.getMinutes() + " min, " + date.getSeconds() + 
									"sec, " + date.getMilliseconds() + " milliSec");
				*/

				var randomNumber = Math.ceil(Math.random()*100)
				if (randomNumber < this.mainframeDetectionChancePerc)
					this.hackingScene.mainframeEnmity = Math.min((this.hackingScene.mainframeEnmity + this.enmityGainIfDetected),
																 100.0);
			}

			this.hackingProgress += delta;

			if (this.hackingProgress >= this.hackingDifficultyInSec)
			{
				this.hacked = true;
				this.activelyBeingHacked = false;
				this.hackingScene.playerActivelyHacking = false;

				if (this.isTrueDataCache == true)
				{
					this.hackingScene.goalFound = true;
					//console.log("found the true data cache!");
				}

				/*
				var date = new Date();
				console.log("Hack end time: " +date.getMinutes() + " min, " + date.getSeconds() + 
									"sec, " + date.getMilliseconds() + " milliSec");
				*/
			}
		}

		if (((this.hackingScene.mainframeEnmity > 0) && (this.type == "mainframe")) ||
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
	var image = this.neutralImage;
	
    if(this.type == "player")
        image = this.playerImage;
    else if ((this.isSUDOInspected == true) && (this.type == "goal") && (this.isTrueDataCache == true))
    	image = this.trueDataCacheImage;
    else if ((this.isSUDOInspected == true) && (this.type == "goal") && (this.isTrueDataCache == false))
    	image = this.hackedEmptyDataCacheImage;
    else if ((this.type == "neutral") && (this.hacked == true))
        image = this.hackedImage;
    else if ((this.type == "neutral") && (this.activelyBeingHacked == true))
        image = this.midHackNeutralImage;
    else if (this.type == "neutral")
        image = this.neutralImage;
    else if ((this.type == "goal") && (this.activelyBeingHacked == false) && (this.hacked == false))
        image = this.dataCacheImage;
    else if ((this.type == "goal") && (this.hacked == true) && (this.isTrueDataCache == false))
        image = this.hackedEmptyDataCacheImage;
    else if ((this.type == "goal") && (this.hacked == true) && (this.isTrueDataCache == true))
    	image = this.trueDataCacheImage;
    else if ((this.type == "goal") && (this.activelyBeingHacked == true))
        image = this.midHackDataCacheImage;
    else if ((this.type == "mainframe") && (this.activelyBeingHacked == false))
        image = this.mainframeImage;
    else if ((this.type == "mainframe") && (this.activelyBeingHacked == true))
        image = this.angryMainframe;
    
  
	this.hackingScene.drawImageAtGridPos(this.gridXPos, this.gridYPos, image);
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
													this.connectedTo[i].gridXPos,
													this.connectedTo[i].gridYPos);
	}

};

HackNode.prototype.addConnection = function(connection)
{
	if( this.connectedTo.indexOf( connection ) < 0 )
	{
		this.connectedTo.push(connection);

		if( connection.connectedTo.indexOf( this ) < 0 )
		{
			connection.connectedTo.push(this);
		}
	}
};

HackNode.prototype.isHackable = function()
{
	var canBeHacked = false;

	if (this.hacked != true)
	{
		for (var i = 0; i < this.connectedTo.length; i++)
		{
			if (this.connectedTo[i].hacked == true)
				canBeHacked = true;
		}
	}

	return canBeHacked;
};