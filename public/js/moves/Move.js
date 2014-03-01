var Move = function(x,y,obj){
    this.obj = obj;
    this.x = x;
    this.y = y;
};

Move.prototype.process = function(){
    this.obj.level.moveTo(this.x,this.y,this.obj);
};