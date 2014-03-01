var Mainframe = function(){

};

Mainframe.prototype.resize = function(){
    this.currentWidth = window.innerWidth;
    this.currentHeight = window.innerHeight;
    $("#screen").get(0).width = this.currentWidth;
    $("#screen").get(0).height = this.currentHeight;
};

Mainframe.prototype.update = function(){
    console.log(this.currentWidth+" "+this.currentHeight);
    this.currentScene.width = this.currentWidth;
    this.currentScene.height = this.currentHeight;
    this.currentScene.ctx = this.ctx;
    this.ctx.clearRect(0,0,this.currentWidth,this.currentHeight);
    this.ctx.save();
    this.currentScene.update();
    this.ctx.restore();
};

Mainframe.prototype.start = function(){
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

    this.currentScene = new TestScene();

    (function animloop(){
        requestAnimFrame(animloop);
        _this.update();
    })();
};