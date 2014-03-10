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
    var tileSet = null;
    /*if(height<=900 && height >=700){
        tileSet = Tileset.createOfficeTileset();
    }
    if(height<=600 && height >=400){
        tileSet = Tileset.createLabTileset();
    }
    if(height<=300 && height >=100){
        tileSet = Tileset.createBasementTileset();
    }
    if(height == 0){
        tileSet = Tileset.createMainframeTileset();
    }*/

    if(height==900) {
        tileSet = Tileset.createOfficeTileset();
    }
    else if(height==800) {
        tileSet = Tileset.createLabTileset();
    }
    else if(height==700) {
        tileSet = Tileset.createBasementTileset();
    }
    else if(height==600) {
        tileSet = Tileset.createMainframeTileset();
    }
    var level = generator.generateLevel( 50, 50, tileSet, height );
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
    Resources.addImage("player","images/street_samurai_1.png");
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

    for(var i = 1 ; i <= 30; i++){
        var s = i+"";
        while(s.length != 4){
            s = "0"+s;
        }
        Resources.addImage("elevator"+i,"images/seq/elevator"+s+".png");
    }

    for(var i = 1 ; i <= 70; i++){
        var s = i+"";
        while(s.length != 4){
            s = "0"+s;
        }
        Resources.addImage("computer"+i,"images/seq/computer"+s+".png");
    }




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
