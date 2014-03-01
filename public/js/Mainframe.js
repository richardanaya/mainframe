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
    this.currentScene.update();
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
    Resources.addImage("grass","images/grass.png");
    Resources.addImage("player","images/player.png");
    Resources.addImage("robot","images/robot.png");

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