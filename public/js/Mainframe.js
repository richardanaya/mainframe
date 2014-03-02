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
<<<<<<< HEAD
Resources.addImage("grass","images/tst_tile.png");
Resources.addImage("player","images/street_samurai.png");
Resources.addImage("player_idle_0","images/street_samurai.png");
Resources.addImage("player_idle_1","images/street_samurai_2.png");
Resources.addImage("robot","images/robot.png");
Resources.addImage("elevator","images/elevator.png");
Resources.addImage("up_elevator","images/up_elevator.png");
Resources.addImage("lab_note","images/lab_note.png");
=======
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
>>>>>>> 8fe8b0d8ccdab1948f23dee41890bd4ae8e84851

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

<<<<<<< HEAD
this.currentScene = new TestScene(this);
this.currentScene.game = this;
=======
    this.currentScene = new StartScene(this);
    this.currentScene.game = this;
>>>>>>> 8fe8b0d8ccdab1948f23dee41890bd4ae8e84851

(function animloop(){
requestAnimFrame(animloop);
_this.update();
})();

$(document).keydown(function(e){_this.onKeyDown(e.keyCode);});
    Hammer(this.ctx.canvas).on("tap", function(e) {
        _this.onTap(e);
    });
};
