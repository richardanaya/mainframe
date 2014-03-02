var Mainframe = function(){

};

Mainframe.prototype.resize = function(){
    this.currentWidth = window.innerWidth;
    this.currentHeight = window.innerHeight;
    $("#screen").get(0).width = this.currentWidth;
    $("#screen").get(0).height = this.currentHeight;
};

Mainframe.prototype.update = function(){
    this.currentScene.width = this.currentWidth;
    this.currentScene.height = this.currentHeight;
    this.currentScene.ctx = this.ctx;
    this.ctx.clearRect(0,0,this.currentWidth,this.currentHeight);
    this.ctx.fillStyle = "#0e0e0e";
    this.ctx.fillRect(0,0,this.currentWidth,this.currentHeight);
    this.ctx.save();

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.currentScene.update(1/60);
    this.ctx.restore();
};

Mainframe.prototype.GetLevel = function(height){
    if(height == 1000){
        var level = new Level();
        var width = 10;
        var height = 10;
        level.width = width;
        level.height = height;
        level.center = { x: Math.floor( width/2), y: Math.floor( height/2 ) };
        level.tileset = Tileset.createOfficeTileset();

        for(var x = 1; x< width-1; x++ ){
            for(var y = 1; y< height-1; y++ ){
                level.tiles[ Utilities.positionToIndex(x,y,level.width) ] = generator.createTile( Level.Types.Floor, level.tileset.floors[0], x, y );
            }
        }

        level.addObjectTo(8,1,new DownElevator());
        if(Flags.flag("lab_note_0")){
            level.addObjectTo(3,3,Pickupable.load("lab_note_0"));
        }


        generator.postProcess( level );

        return level;
    }

    return generator.generateLevel( 100, 100, Tileset.createOfficeTileset() );
};

Mainframe.prototype.onKeyDown = function(key){
if(this.currentScene){
this.currentScene.onKeyDown(key);
}
};

Mainframe.prototype.onTap = function(e){
    if(this.currentScene){
        this.currentScene.onTap(e.gesture.touches[0].offsetX, e.gesture.touches[0].offsetY);

    }
};
Mainframe.prototype.changeScene = function(s){
    this.currentScene = s;
};


Mainframe.prototype.start = function(){
    Resources.addImage("grass","images/tst_tile.png");
    Resources.addImage("player","images/street_samurai.png");
    Resources.addImage("player_idle_0","images/street_samurai.png");
    Resources.addImage("player_idle_1","images/street_samurai_2.png");
    Resources.addImage("robot","images/robot.png");
    Resources.addImage("elevator","images/elevator.png");
    Resources.addImage("up_elevator","images/up_elevator.png");
    Resources.addImage("lab_note","images/lab_note.png");
    Resources.addImage("title","images/title.png");
    Resources.addImage("robot_idle_0","images/robot_1.png");
    Resources.addImage("robot_idle_1","images/robot_2.png");
    Resources.addImage("keycard","images/keycard.png");

var _this = this;
this.ctx = $('#screen').get(0).getContext('2d');
$(window).resize(function(){_this.resize();});
this.resize();
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
function( callback ){
	window.setTimeout(callback, 1000 / 60);
};
})();

    this.currentScene = new StartScene(this);
    this.currentScene.game = this;

(function animloop(){
requestAnimFrame(animloop);
_this.update();
})();

$(document).keydown(function(e){_this.onKeyDown(e.keyCode);});
    Hammer(this.ctx.canvas).on("tap", function(e) {
        _this.onTap(e);
    });
};
