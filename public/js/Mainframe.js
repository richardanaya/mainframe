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
                //level.tiles[ Utilities.positionToIndex(x,y,level.width) ].image = Resources.getImage("Floor3Purple");
            }
        }



        var de = new DownElevator();
        level.addObjectTo(8,1,de);
        de.image = Resources.getImage("stairs");
        for(var i in Pickupable.Items){
            level.addObjectTo(Utilities.randRangeInt(1,8),Utilities.randRangeInt(1,8),Pickupable.load(i));

        }
        level.addObjectTo(Utilities.randRangeInt(1,8),Utilities.randRangeInt(1,8),new Robot());

        generator.postProcess( level );

        for(var x = 0; x< width; x++ ){
            for(var y = 0; y< height; y++ ){
                if(level.tiles[ Utilities.positionToIndex(x,y,level.width) ]){
                    level.tiles[ Utilities.positionToIndex(x,y,level.width) ].explored = true;
                }
            }
        }

        return level;
    }

    var level = generator.generateLevel( 50, 50, Tileset.createOfficeTileset() );
    level.designRooms(this.currentHeight);
    return level;
};

Mainframe.prototype.onKeyDown = function(key){
if(this.currentScene){
this.currentScene.onKeyDown(key);
}
};

Mainframe.prototype.onTap = function(e){
    if(this.currentScene){
        this.currentScene.onTap(e.gesture.touches[0].clientX, e.gesture.touches[0].clientY);

    }
};
Mainframe.prototype.changeScene = function(s){
    this.currentScene = s;
};


Mainframe.prototype.start = function(){
    Resources.addImage("grass","images/tst_tile.png");
    Resources.addImage("player","images/street_samurai.png");
    Resources.addImage("player_idle_0","images/street_samurai_1.png");
    Resources.addImage("player_idle_1","images/street_samurai_2.png");
    Resources.addImage("robot","images/robot.png");
    Resources.addImage("elevator","images/elevator.png");
    Resources.addImage("up_elevator","images/up_elevator.png");
    Resources.addImage("lab_note","images/lab_note.png");
    Resources.addImage("robot_idle_0","images/robot_1.png");
    Resources.addImage("robot_idle_1","images/robot_2.png");
    Resources.addImage("keycard","images/keycard.png");
    Resources.addImage("fowoverlay","images/fogofwar.png");

    Resources.addImage("elevator1","images/seq/elevator0001.png");
    Resources.addImage("elevator2","images/seq/elevator0002.png");
    Resources.addImage("elevator3","images/seq/elevator0003.png");
    Resources.addImage("elevator4","images/seq/elevator0004.png");
    Resources.addImage("elevator5","images/seq/elevator0005.png");
    Resources.addImage("elevator6","images/seq/elevator0006.png");
    Resources.addImage("elevator7","images/seq/elevator0007.png");
    Resources.addImage("elevator8","images/seq/elevator0008.png");
    Resources.addImage("elevator9","images/seq/elevator0009.png");
    Resources.addImage("elevator10","images/seq/elevator0010.png");
    Resources.addImage("elevator11","images/seq/elevator0011.png");
    Resources.addImage("elevator12","images/seq/elevator0012.png");
    Resources.addImage("elevator13","images/seq/elevator0013.png");
    Resources.addImage("elevator14","images/seq/elevator0014.png");
    Resources.addImage("elevator15","images/seq/elevator0015.png");
    Resources.addImage("elevator16","images/seq/elevator0016.png");
    Resources.addImage("elevator17","images/seq/elevator0017.png");
    Resources.addImage("elevator18","images/seq/elevator0018.png");
    Resources.addImage("elevator19","images/seq/elevator0019.png");
    Resources.addImage("elevator20","images/seq/elevator0020.png");
    Resources.addImage("elevator21","images/seq/elevator0021.png");
    Resources.addImage("elevator22","images/seq/elevator0022.png");
    Resources.addImage("elevator23","images/seq/elevator0023.png");
    Resources.addImage("elevator24","images/seq/elevator0024.png");
    Resources.addImage("elevator25","images/seq/elevator0025.png");
    Resources.addImage("elevator26","images/seq/elevator0026.png");
    Resources.addImage("elevator27","images/seq/elevator0027.png");
    Resources.addImage("elevator28","images/seq/elevator0028.png");
    Resources.addImage("elevator29","images/seq/elevator0029.png");
    Resources.addImage("elevator30","images/seq/elevator0030.png");




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
