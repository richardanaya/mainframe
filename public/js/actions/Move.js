var Move = function(x,y,obj){
    this.obj = obj;
    this.x = x;
    this.y = y;
};

Move.prototype = Object.create(Action.prototype);

Move.prototype.process = function(){
    if(!this.isObjectStillInPlay(this.obj)){ return; }
    this.obj.level.moveTo(this.x,this.y,this.obj);
};