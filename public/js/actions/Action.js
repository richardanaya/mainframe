var Action = function(){

}

Action.prototype.isObjectStillInPlay = function(o){
    return (o.x != -1 && o.y != -1);
}