var HackNode = function(gridXPos, gridYPos, type, scene)
{
	this.gridXPos = gridXPos;
	this.gridYPos = gridYPos;
	this.type = type;
	//this.ConnectedTo = neighborsArray;
	this.hackingScene = scene;
}

HackNode.prototype.update = function(delta)
{
	this.hackingScene.drawCircleAtGridPos(this.gridXPos, this.gridYPos, this.type);
}