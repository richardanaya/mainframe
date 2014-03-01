var Resources = function(){

};

Resources.images = {}

Resources.addImage = function(name,src) {
    var m = new Image();
    m.src = src;
    this.images[name] = m;
};