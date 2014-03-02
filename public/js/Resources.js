var Resources = function(){

};

Resources.images = {}

Resources.addImage = function(name,src) {
    var m = new Image();
    m.src = src;
    Resources.images[name] = m;
};

Resources.getImage = function(name,src) {
    if(!Resources.images[name]){
        var img = new Image();
        img.src = "images/"+name+".png";
        Resources.images[name] = img;
    }
    return Resources.images[name];
};