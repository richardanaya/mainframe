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


        //spawn elevator
        var de = new DownElevator();
        level.addObjectTo(8,1,de);
        de.image = Resources.getImage("stairs");

        //level.addObjectTo(1,1,Monster.load('businessman'));
        //level.addObjectTo(4,4,Pickupable.load('taser'));
        //level.addObjectTo(7,7,Pickupable.load('janitors_note'));
        //level.addObjectTo(8,8,Pickupable.load('hackable_safe'));

        //level.addObjectTo(4,3,Pickupable.load('mirror_shades'));
        
        /*  level.addObjectTo(7,7,Pickupable.Items('hackable_save'));*/
        //spawn all items
        for(var p in Pickupable.Items){
            level.addObjectTo(Utilities.randRangeInt(1,8),Utilities.randRangeInt(1,8),Pickupable.load(p));
        }

        generator.postProcess( level );

        for(var x = 0; x< width; x++ ){
            for(var y = 0; y< height; y++ ){
                if(level.tiles[ Utilities.positionToIndex(x,y,level.width) ]){
                    level.tiles[ Utilities.positionToIndex(x,y,level.width) ].explored = true;
                }
            }
        }

        Pickupable.randomizePotionList();

        return level;
    }

    if(height == -100){
        var level = new Level();
        var width = 14;
        var height = 12;
        level.width = width;
        level.height = height;
        level.center = { x: Math.floor( width/2), y: Math.floor( height/2 ) };
        level.tileset = Tileset.createOfficeTileset();




        for(var x = 1; x< width-1; x++ ){
            for(var y = 1; y< height-1; y++ ){
                if(x>3 && x< 10 && y>1 && y<5){
                    level.tiles[ Utilities.positionToIndex(x,y,level.width) ] = generator.createTile( Level.Types.Wall, level.tileset.floors[0], x, y );
                }
                else {
                    level.tiles[ Utilities.positionToIndex(x,y,level.width) ] = generator.createTile( Level.Types.Floor, level.tileset.floors[0], x, y );
                }
                //level.tiles[ Utilities.positionToIndex(x,y,level.width) ].image = Resources.getImage("Floor3Purple");

            }
        }

        //spawn all items
        /*for(var p in Pickupable.Items){
         level.addObjectTo(Utilities.randRangeInt(1,8),Utilities.randRangeInt(1,8),Pickupable.load(p));
         }*/

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

    if(Level.isOfficeHeight(height)) {
        tileSet = Tileset.createOfficeTileset();
    }
    else if(Level.isLabHeight(height)) {
        tileSet = Tileset.createLabTileset();
        if(height == 400){
            //store level
        }
    }
    else if(Level.isBasementHeight(height)) {
        tileSet = Tileset.createBasementTileset();
    }
    else if(Level.isMainframeHeight(height)) {
        tileSet = Tileset.createMainframeTileset();
        //create mainframe block
    }
    var level = generator.generateLevel( 50, 50, tileSet, height );
    level.designRooms(height);
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
    Resources.addImage("sop13_1","images/SOP13_1.png");
    Resources.addImage("sop13_2","images/SOP13_2.png");
    Resources.addImage("masamune","images/item_masamume.png");
    Resources.addImage("mirror_shades", "images/mirror_shades.png");

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

$(document).keydown(function(e){_this.onKeyDown(e.keyCode);
    e.preventDefault();});
    Hammer(this.ctx.canvas).on("tap", function(e) {
        _this.onTap(e);
    });

};
