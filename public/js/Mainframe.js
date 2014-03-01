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
    this.ctx.save();

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.currentScene.update(1/60);
    this.ctx.restore();
};

Mainframe.prototype.GetLevel = function(height){
    return new Level();
};

Mainframe.prototype.onKeyDown = function(key){
    if(this.currentScene){
        this.currentScene.onKeyDown(key);
    }
};

Mainframe.prototype.onMouseDown = function(e){
    if(this.currentScene){
        this.currentScene.onTouchDown(e.offsetX, e.offsetY);
    }
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

    this.currentScene = new TestScene(this);
    this.currentScene.game = this;

    (function animloop(){
        requestAnimFrame(animloop);
        _this.update();
    })();

    $(document).keydown(function(e){_this.onKeyDown(e.keyCode);});
    $('#screen').mousedown(function(e){_this.onMouseDown(e);});
};