var HackNode = function(gridXPos, gridYPos, type, scene)
{
	this.gridXPos = gridXPos;
	this.gridYPos = gridYPos;
	this.type = type;
	this.connectedTo = [];
	this.hackingScene = scene;
};

HackNode.prototype.update = function(delta)
{
	this.hackingScene.drawCircleAtGridPos(this.gridXPos, this.gridYPos, this.type);
}


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